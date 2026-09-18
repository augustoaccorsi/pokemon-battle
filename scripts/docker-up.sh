#!/bin/sh
export DOCKER_API_VERSION=1.43

# Start Colima (lightweight Docker runtime, no Desktop required)
if ! docker info > /dev/null 2>&1; then
  echo "Starting Colima..."
  colima start
fi

docker start pokemon-pg 2>/dev/null || \
  docker run -d --name pokemon-pg \
    -e POSTGRES_DB=pokemon_battle \
    -e POSTGRES_USER=pokemon \
    -e POSTGRES_PASSWORD=pokemon \
    -p 5432:5432 \
    postgres:16
