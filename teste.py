import boto3
import datetime

# Crie um cliente do Athena
client = boto3.client('athena', region_name='YOUR_REGION')

# Liste as execuções de consulta
response = client.list_query_executions()

query_execution_ids = response['QueryExecutionIds']

# Defina a data de início para filtrar (por exemplo, 30 dias atrás)
start_date = datetime.datetime.now() - datetime.timedelta(days=30)

# Para cada ID de execução de consulta, obtenha detalhes da consulta
for query_id in query_execution_ids:
    query_details = client.get_query_execution(QueryExecutionId=query_id)
    query_timestamp = query_details['QueryExecution']['Status']['SubmissionDateTime']
    
    # Filtre as consultas com base no timestamp de execução
    if query_timestamp > start_date:
        print(query_details['QueryExecution']['Query'])
