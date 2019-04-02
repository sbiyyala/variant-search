import datetime
import os
import unittest

from scripts.import_variants import gen_variants


class GenVariantsTest(unittest.TestCase):
    """
    Variant import to Elastic search tests
    """

    def test_gen_variants(self):
        cwd = os.path.dirname(os.path.abspath(__file__))
        variants = gen_variants(cwd + '/scripts/test.tsv')
        li = list(variants)
        self.assertEqual(li, [{
            'accession': None,
            'alias': '',
            'alt': None,
            'assembly': None,
            'chr': None,
            'gene': 'CDKL5',
            'genomicStart': None,
            'genomicStop': None,
            'inferredClassification': 'Pathogenic',
            'lastEvaluated': datetime.date(2014, 3, 13),
            'lastUpdated': datetime.date(2017, 9, 14),
            'nucleotideChange': 'N_CHANGE',
            'otherMappings': ['N_CHANGE', 'N_OTHER_MAPPING'],
            'proteinChange': '',
            'ref': None,
            'region': '',
            'reportedAlt': None,
            'reportedClassification': 'Pathogenic',
            'reportedRef': None,
            'source': 'ClinVar',
            'submitterComment': None,
            'transcripts': ['NM_003159.2'],
            'url': 'sourceUrl'
        }])
