import boto3
import re
import json
from datetime import datetime, timedelta

def get_tables_from_queries(workgroups):
    # Criar um cliente para o Athena
    client = boto3.client('athena')
    
    # Definir a data de início e fim para buscar as queries do dia anterior
    end_date = datetime.now()
    start_date = end_date - timedelta(days=1)
    
    # Conjunto para armazenar os nomes das tabelas de forma única
    tables_set = set()
    
    # Expressão regular para encontrar tabelas
    pattern = re.compile(r'(?i)(?:from|join)\s+([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)')
    
    # Iterar sobre cada workgroup
    for workgroup in workgroups:
        next_token = None
        while True:
            # Obter as execuções de query
            if next_token:
                response = client.list_query_executions(
                    WorkGroup=workgroup,
                    MaxResults=1000,
                    NextToken=next_token
                )
            else:
                response = client.list_query_executions(
                    WorkGroup=workgroup,
                    MaxResults=1000
                )
            
            # Se não houver mais execuções de query, sair do loop
            if 'QueryExecutionIds' not in response:
                break
            
            # Iterar sobre cada ID de execução de query
            for query_id in response['QueryExecutionIds']:
                # Obter os detalhes da execução da query
                query_details = client.get_query_execution(
                    QueryExecutionId=query_id
                )
                
                # Verificar a data da execução da query
                query_date = query_details['QueryExecution']['Status']['SubmissionDateTime']
                if query_date < start_date:
                    return [json.loads(item) for item in tables_set]
                
                # Extrair a query SQL
                sql = query_details['QueryExecution']['Query']
                
                # Usar a expressão regular para encontrar os nomes das tabelas
                matches = pattern.findall(sql)
                for match in matches:
                    table_dict = {'database': match[0], 'table': match[1]}
                    tables_set.add(json.dumps(table_dict))
            
            # Se houver um token para a próxima página, atualize o next_token
            next_token = response.get('NextToken')
            if not next_token:
                break
    
    # Converter o conjunto para uma lista de dicionários
    tables = [json.loads(item) for item in tables_set]
    
    return tables

# Testar a função
workgroups = ['workgroup1', 'workgroup2']
print(get_tables_from_queries(workgroups))
