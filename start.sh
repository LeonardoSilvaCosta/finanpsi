#!/bin/bash
# start.sh

# Aguardar o PostgreSQL ficar disponível
echo "Aguardando PostgreSQL ficar disponível..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL está disponível!"

# Executar migrações
echo "Executando migrações do Prisma..."
npx prisma migrate deploy

# Se migrate deploy falhar (em desenvolvimento), usar migrate dev
if [ $? -ne 0 ]; then
  echo "Usando migrate dev para desenvolvimento..."
  npx prisma migrate dev --name init
fi

# Iniciar aplicação
echo "Iniciando aplicação..."
node server.js