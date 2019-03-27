#!/usr/bin/env bash

retry=0
 until [[ $retry -ge 10 ]]
do
    curl -f $ES_HOST && break
    retry=$[$retry+1]
    sleep 10
done

# Create variants' index, batch import variants
python manage.py runscript import_variants

# start services
python manage.py runserver 0.0.0.0:8000