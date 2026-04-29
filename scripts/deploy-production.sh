#!/bin/bash

set -euo pipefail

REPO_DIR="${REPO_DIR:-$HOME/apps/bookwise}"
BRANCH="${BRANCH:-main}"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE="deploy/.env.production"

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "Repository not found at $REPO_DIR"
  exit 1
fi

cd "$REPO_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE. Create it from deploy/.env.production.example first."
  exit 1
fi

echo "Deploying branch $BRANCH in $REPO_DIR"

git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d mysql

mysql_container_id="$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps -q mysql)"

if [ -z "$mysql_container_id" ]; then
  echo "MySQL container was not created."
  exit 1
fi

echo "Waiting for MySQL to become healthy..."

for attempt in $(seq 1 24); do
  mysql_status="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$mysql_container_id")"

  if [ "$mysql_status" = "healthy" ]; then
    break
  fi

  if [ "$attempt" -eq 24 ]; then
    echo "MySQL did not become healthy in time."
    exit 1
  fi

  sleep 5
done

echo "Applying Prisma schema changes..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm app npm run db:push

echo "Starting application stack..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build app caddy

echo "Deployment completed successfully."
