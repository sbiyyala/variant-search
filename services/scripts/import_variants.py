import csv
import logging
import os
import re
from datetime import datetime

from elasticsearch import Elasticsearch
from elasticsearch.helpers import streaming_bulk


def to_date(elem):
    match = re.search(r'\d{4}-\d{2}-\d{2}', elem)
    if match:
        return datetime.strptime(match.group(), '%Y-%m-%d').date()
    else:
        return None


def gen_variants(path):
    with open(path) as tsv_file:
        reader = csv.DictReader(tsv_file, dialect='excel-tab')
        for row in reader:
            yield {
                'gene': row.get('Gene'),
                'nucleotideChange': row.get('Nucleotide Change'),
                'proteinChange': row.get('Protein Change'),
                'otherMappings': [x.strip() for x in row.get('Other Mappings').split(',')],
                'alias': row.get('Alias'),
                'transcripts': [x.strip() for x in row.get('Transcripts').split(',')],
                'region': row.get('Region'),
                'reportedClassification': row.get('Reported Classification'),
                'inferredClassification': row.get('Inferred Classification'),
                'source': row.get('Source'),
                'lastEvaluated': to_date(row.get('Last Evaluated')),
                'lastUpdated': to_date(row.get('Last Updated')),
                'url': row.get('URL'),
                'submitterComment': row.get('Submitter Comment'),
                'assembly': row.get('Assembly'),
                'chr': row.get('Chr'),
                'genomicStart': row.get('Genomic Start'),
                'genomicStop': row.get('Genomic Stop'),
                'ref': row.get('Ref'),
                'alt': row.get('Alt'),
                'accession': row.get('Accession'),
                'reportedRef': row.get('Reported Ref'),
                'reportedAlt': row.get('Reported Alt')
            }


def create_variants_index(client, index):
    create_index_body = {
        'settings': {
            'number_of_shards': 1,
            'number_of_replicas': 0,

            'analysis': {
                'analyzer': {
                    'autocomplete': {
                        'type': 'custom',
                        'tokenizer': 'autocomplete',
                        'filter': [
                            'lowercase'
                        ]
                    },
                    'autocomplete_search': {
                        'tokenizer': 'lowercase'
                    }
                },
                'tokenizer': {
                    'autocomplete': {
                        'type': 'edge_ngram',
                        'min_gram': 1,
                        'max_gram': 20
                    }
                }
            }
        },
        'mappings': {
            'variant': {
                'properties': {
                    'gene': {
                        'type': 'text',
                        'analyzer': 'autocomplete',
                        'fields': {
                            'keyword': {
                                'type': 'keyword'
                            }
                        }
                    },
                    'nucleotideChange': {'type': 'text'},
                    'proteinChange': {'type': 'text'},
                    'otherMappings': {'type': 'text'},
                    'alias': {'type': 'text'},
                    'transcripts': {'type': 'text'},
                    'region': {'type': 'text'},
                    'reportedClassification': {'type': 'text'},
                    'inferredClassification': {'type': 'text'},
                    'source': {'type': 'text', 'fielddata': 'true'},
                    'lastEvaluated': {'type': 'date'},
                    'lastUpdated': {'type': 'date'},
                    'url': {'type': 'text'},
                    'submitterComment': {'type': 'text'},
                    'assembly': {'type': 'text'},
                    'chr': {'type': 'text'},
                    'genomicStart': {'type': 'text'},
                    'genomicStop': {'type': 'text'},
                    'ref': {'type': 'text'},
                    'alt': {'type': 'text'},
                    'accession': {'type': 'text'},
                    'reportedRef': {'type': 'text'},
                    'reportedAlt': {'type': 'text'}
                }
            }
        }
    }

    # delete and create empty index
    client.indices.delete(index, ignore=404)
    client.indices.create(
        index=index,
        body=create_index_body,
    )


def load(client, path='variants.tsv', index='variants'):
    create_variants_index(client, index)
    for ok, result in streaming_bulk(
            client,
            gen_variants(path),
            index=index,
            doc_type='variant',
            chunk_size=100):

        action, result = result.popitem()
        doc_id = '/%s/doc/%s' % (index, result['_id'])
        if not ok:
            raise Exception('Failed to %s document %s: %r' % (action, doc_id, result))


def run(*args):
    tracer = logging.getLogger('elasticsearch.trace')
    tracer.setLevel(logging.ERROR)
    tracer.addHandler(logging.FileHandler('/tmp/es_trace.log'))

    es_client = Elasticsearch(os.environ.get('ES_HOST'))
    load(es_client, path='scripts/variants.tsv')
