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
        if d["id"] == att["dataTypeId"]:
            data_type = d.get("name", None)
            break

    if data_type is None:
        raise Exception(f"DataType not found for attribute {att['dataTypeId']}")

    columns[att["id"]] = {
        "name": att.get("name", None),
        "data_type": data_type
    }
