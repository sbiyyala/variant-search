from django.core.validators import URLValidator
from django.db import models


class Variant(models.Model):
    gene = models.CharField(max_length=120)
    nucleotide_change = models.CharField(max_length=255)
    protein_change = models.CharField(max_length=255)
    other_mappings = models.CharField(max_length=255)
    alias = models.CharField(max_length=120)
    transcripts = models.CharField(max_length=120)
    region = models.CharField(max_length=120)
    reported = models.DateField()
    classification = models.DateField()
    inferred = models.TextField()
    source = models.CharField(max_length=255)
    last_evaluated = models.DateField()
    last_updated = models.DateField()
    url = models.TextField(validators=[URLValidator()])
    submitter_comment = models.TextField()
    assembly = models.TextField()
    chr = models.TextField()
    genomic_start = models.CharField(max_length=10)
    genomic_end = models.CharField(max_length=10)
    ref = models.TextField()
    alt = models.TextField()
    accession = models.TextField()
    reported_ref = models.TextField()
    reported_alt = models.TextField()

    def __str__(self):
        return self.gene




