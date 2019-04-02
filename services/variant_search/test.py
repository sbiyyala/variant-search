from django.test import RequestFactory, SimpleTestCase

from variant_search.views import suggest, search

'''
Integration tests for suggest/search api. Needs a running/loaded ES instance. 
'''


class VariantTests(SimpleTestCase):

    def setUp(self):
        self.factory = RequestFactory()

    """
    Test expected [deduped && sorted] response
    """

    def test_suggest(self):
        request = self.factory.get('/api/variant/suggest?q=ABCA')
        response = suggest(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            [
                {"gene": "ABCA1"},
                {"gene": "ABCA12"},
                {"gene": "ABCA2"},
                {"gene": "ABCA3"},
                {"gene": "ABCA4"},
                {"gene": "ABCA5"}
            ])

    """
    Test expected [deduped && sorted by evaluated date] response
    """

    def test_search(self):
        request = self.factory.get('/api/variant/search?q=A1BG-AS1')
        response = search(request)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            [
                {'accession': 'NC_000019.9',
                 'alias': '',
                 'alt': '-',
                 'assembly': 'GRCh37',
                 'chr': '19',
                 'gene': 'A1BG-AS1',
                 'genomicStart': 'NULL',
                 'genomicStop': 'NULL',
                 'inferredClassification': 'Variant of uncertain significance',
                 'lastEvaluated': '2013-07-16',
                 'lastUpdated': '2017-09-14',
                 'nucleotideChange': '',
                 'otherMappings': ['NC_000019.10:g.(?_56353449)_(58445521_?)dup',
                                   'NC_000019.8:g.(?_61556630)_(63648700_?)dup',
                                   'NC_000019.9:g.(?_56864818)_(58956888_?)dup'],
                 'proteinChange': '',
                 'ref': '-',
                 'region': '',
                 'reportedAlt': 'NULL',
                 'reportedClassification': 'Uncertain significance',
                 'reportedRef': 'NULL',
                 'source': 'ClinVar',
                 'submitterComment': '',
                 'transcripts': ['NC_000019.10', 'NC_000019.8', 'NC_000019.9'],
                 'url': 'https://www.ncbi.nlm.nih.gov/clinvar/RCV000141900'
                 }
            ])