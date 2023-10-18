import boto3

# Substitua 'your_region' pelo nome da sua região AWS (por exemplo, 'us-east-1' para a região Leste dos EUA).
region = 'your_region'

# Substitua 'your_neptune_cluster_identifier' pelo identificador do seu cluster Neptune.
cluster_identifier = 'your_neptune_cluster_identifier'

# Crie uma sessão do cliente para o Amazon Neptune
session = boto3.Session(region_name=region)
neptune_client = session.client('neptune')

# Use o método describe_db_clusters para obter informações sobre o cluster
response = neptune_client.describe_db_clusters(DBClusterIdentifier=cluster_identifier)

# Verifique o status do cluster
cluster = response['DBClusters'][0]
cluster_status = cluster['Status']

print(f'O status do cluster {cluster_identifier} é: {cluster_status}')

columns = {}
for att in attributes:
    data_type = None

    for d in dataTypes:
        if d["id"] == att["dataType"]:
            data_type = d.get("name", None)
            break

    if data_type is None:
        raise Exception(f"DataType not found for attribute {att['dataType']}")

    columns[att["id"]] = {
        "name": att.get("name", None),
        "data_type": data_type
    }

for dataType in dataTypes:
    if "id" in dataType and "name" in dataType:
        params = params.replace(dataType["id"], dataType["name"])

for attribute in attributes:
    if "id" in attribute and "name" in attribute:
        params = params.replace(attribute["id"], attribute["name"])

g.V().has('vertex_property_key', 'vertex_property_value').sideEffect(both().drop()).drop().next()

import re

def remove_dates_from_s3_path(s3_path):
    parts = s3_path.split('/')
    new_parts = []
    
    for part in parts:
        # Verifique se a parte atual não contém uma data
        if not re.search(r'(\d{4}-\d{2}-\d{2}|\d{8}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4})', part):
            new_parts.append(part)
    
    new_path = '/'.join(new_parts)
    return new_path

# Exemplo de uso
s3_path = "s3://bucket/prefix/tabela/01-06-2023"
new_path = remove_dates_from_s3_path(s3_path)
print(new_path)
