#!/bin/bash

docker run --rm  --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 postgres

# to connect : psql -h localhost -U postgres -d postgres
# connect string : postgresql://postgres:docker@localhost:5432/postgres