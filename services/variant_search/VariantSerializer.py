from rest_framework import serializers

from services.variant_search.models import Variant


class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ('gene')