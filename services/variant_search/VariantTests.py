from unittest import TestCase

from django.test import RequestFactory

from variant_search.views import suggest, search


class VariantTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_suggest(self):
        request = self.factory.get('/api/variant/suggest?q=ab')
        response = suggest(request)
        print(response.content)
        assert response.status_code == 200

    def test_search(self):
        request = self.factory.get('/api/variant/search?q=ABRAXAS1')
        response = search(request)
        print(response.content)
        assert response.status_code == 200
