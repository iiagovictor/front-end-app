import boto3

def run_athena_query(query, database, s3_output):
    """
    Executa uma consulta no Athena e retorna o resultado.
    
    Parâmetros:
    - query: A consulta SQL que você deseja executar.
    - database: O nome do banco de dados Athena.
    - s3_output: O local do S3 onde os resultados da consulta serão salvos.
    """
    client = boto3.client('athena')
    
    response = client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={
            'Database': database
        },
        ResultConfiguration={
            'OutputLocation': s3_output,
        }
    )
    
    query_execution_id = response['QueryExecutionId']
    
    # Aguarde a consulta ser concluída e obtenha o status
    status = 'RUNNING'
    while status in ['RUNNING', 'QUEUED']:
        response = client.get_query_execution(QueryExecutionId=query_execution_id)
        status = response['QueryExecution']['Status']['State']
    
    if status == 'SUCCEEDED':
        print("Consulta concluída com sucesso.")
    elif status == 'FAILED':
        print("Consulta falhou.")
    else:
        print("Consulta foi cancelada.")
    
    return status

# Exemplo de uso:
query = "SELECT * FROM minha_tabela LIMIT 10;"
database = "meu_banco_de_dados"
s3_output = "s3://meu-bucket/caminho/para/saida/"
run_athena_query(query, database, s3_output)
``
