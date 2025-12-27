#!/bin/bash
echo "=== Verificando conexión a la base de datos ==="

# Método 1: Docker (si está usando PostgreSQL en Docker)
docker exec -it $(docker ps | grep postgres | awk '{print $1}') psql -U postgres -d ssoma_db -c "SELECT COUNT(*) as empresas FROM tbl_empresas WHERE tenant_id = 'KALLPA';" 2>/dev/null

# Método 2: PostgreSQL local
PGPASSWORD=postgres psql -h localhost -U postgres -d ssoma_db -c "SELECT COUNT(*) as empresas FROM tbl_empresas WHERE tenant_id = 'KALLPA';" 2>/dev/null

echo ""
echo "Si ambos métodos fallaron, necesitas conectarte manualmente a la BD"
