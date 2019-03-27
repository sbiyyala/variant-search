FROM python:3.7
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y --no-install-recommends \
    binutils \
    libproj-dev \
    gdal-bin \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/services
COPY requirements.txt /app/services
#COPY importVariants.py /app/services
#COPY variants.tsv /app/services
COPY scripts /app/services

RUN pip install -r requirements.txt

#CMD ["python", "importVariants.py", "--host", "elasticsearch"]
CMD ["python", "manage.py", "runscript", "import_variants"]

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]