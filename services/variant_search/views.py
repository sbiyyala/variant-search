import os

import elasticsearch
from django.http import JsonResponse, HttpResponseBadRequest

MAX_SIZE = 10000

es_client = elasticsearch.Elasticsearch(os.environ.get('ES_HOST'))


def suggest(request):
    query_params = request.GET
    if not query_params.__contains__('q'):
        return HttpResponseBadRequest()
    else:
        term = query_params['q']
        result = es_client.search(index='variants',
                                  doc_type='variant',
                                  body={
                                      "query": {
                                          "match_phrase_prefix": {
                                              "gene": term
                                          }
                                      },
                                      "sort": [
                                          {
                                              "gene.keyword": {
                                                  "order": "asc"
                                              }
                                          }
                                      ]
                                  },
                                  size=MAX_SIZE,
                                  _source_include=['gene'])

        variants = map(lambda x: x['_source'], result['hits']['hits'])
        deduped = list({variant['gene']: variant for variant in variants}.values())
        return JsonResponse(deduped, safe=False)


def search(request):
    query_params = request.GET
    if not query_params.__contains__('q'):
        return HttpResponseBadRequest()
    else:
        term = query_params['q']
        result = es_client.search(index='variants',
                                  doc_type='variant',
                                  body={
                                      "query": {
                                          "term": {
                                              "gene.keyword": term
                                          }
                                      },
                                      "sort": [
                                          {
                                              "lastEvaluated": {
                                                  "order": "desc"
                                              }
                                          }
                                      ]
                                  },
                                  size=MAX_SIZE)

        results = map(lambda x: x['_source'], result['hits']['hits'])
        seen = set()
        variants = [x for x in list(results) if not (x['nucleotideChange'] in seen or seen.add(x['nucleotideChange']))]
        return JsonResponse(variants, safe=False)