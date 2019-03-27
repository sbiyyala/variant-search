FROM python:3.7
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y --no-install-recommends \
    binutils \
    libproj-dev \
    gdal-bin \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/services
COPY requirements.txt /app/services
COPY scripts /app/services

RUN pip install -r requirements.txt

EXPOSE 8000