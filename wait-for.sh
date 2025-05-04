#!/bin/sh
# wait-for.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z $host 5432; do
  echo "Aguardando o banco de dados em $host:5432..."
  sleep 1
done

exec $cmd
