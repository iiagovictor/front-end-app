import boto3
import pandas as pd

def run_athena_query_and_get_results(query, database, s3_output):
    """
    Executa uma consulta no Athena e retorna os resultados em um dataframe do pandas.
    
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
    
    if status != 'SUCCEEDED':
        print("Consulta não teve sucesso.")
        return None
    
    # Se a consulta foi bem-sucedida, leia os resultados do S3 em um dataframe do pandas
    result_s3_path = s3_output + query_execution_id + '.csv'
    s3 = boto3.resource('s3')
    bucket_name, key_name = result_s3_path.replace("s3://", "").split("/", 1)
    obj = s3.Object(bucket_name, key_name)
    data = obj.get()['Body'].read().decode('utf-8')
    
    dataframe = pd.read_csv(pd.compat.StringIO(data))
    
    return dataframe

# Exemplo de uso:
query = "SELECT * FROM minha_tabela LIMIT 10;"
database = "meu_banco_de_dados"
s3_output = "s3://meu-bucket/caminho/para/saida/"
df = run_athena_query_and_get_results(query, database, s3_output)
print(df)
