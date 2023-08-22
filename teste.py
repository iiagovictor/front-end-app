import boto3
import re
import json
import pytz
from datetime import datetime, timedelta

def list_available_workgroups():
    client = boto3.client('athena')
    workgroups = []
    response = client.list_work_groups()
    for workgroup in response['WorkGroups']:
        workgroups.append(workgroup['Name'])
    return workgroups

def get_s3_path(datasource, database, table):
    client = boto3.client('glue')
    response = client.get_table(CatalogId=datasource, DatabaseName=database, Name=table)
    s3_path = response['Table']['StorageDescriptor']['Location']
    return s3_path

def get_tables_from_queries(workgroups):
    client = boto3.client('athena')
    
    # Definir a data de início e fim para buscar as queries do dia anterior em UTC-3
    tz = pytz.timezone('America/Sao_Paulo')
    end_date = datetime.now(tz)
    start_date = end_date - timedelta(days=1)
    
    tables_set = set()
    query_count = 0
    
    # Expressão regular atualizada para capturar "datasource", "database" e "tabela"
    pattern = re.compile(r'(?i)(?:from|join|union)[\s\n]+\"([a-zA-Z0-9_]+)\"\.\"([a-zA-Z0-9_]+)\"\.\"([\s\n]*[a-zA-Z0-9_]+)\"')
    
    for workgroup in workgroups:
        next_token = None
        while True:
            if next_token:
                response = client.list_query_executions(WorkGroup=workgroup, MaxResults=50, NextToken=next_token)
            else:
                response = client.list_query_executions(WorkGroup=workgroup, MaxResults=50)
            
            if 'QueryExecutionIds' not in response:
                break
            
            for query_id in response['QueryExecutionIds']:
                query_details = client.get_query_execution(QueryExecutionId=query_id)
                query_date_utc = query_details['QueryExecution']['Status']['SubmissionDateTime']
                query_date = query_date_utc.astimezone(tz)
                
                if query_date.date() < start_date.date():
                    return [json.loads(item) for item in tables_set], query_count
                
                query_count += 1
                sql = query_details['QueryExecution']['Query']
                
                matches = pattern.findall(sql)
                for match in matches:
                    datasource, database, table = match
                    s3_path = get_s3_path(datasource, database, table)
                    table_dict = {'datasource': datasource, 'database': database, 'table': table, 's3_path': s3_path}
                    tables_set.add(json.dumps(table_dict))
            
            next_token = response.get('NextToken')
            if not next_token:
                break
    
    tables = [json.loads(item) for item in tables_set]
    return tables, query_count

workgroups = list_available_workgroups()
tables, total_queries = get_tables_from_queries(workgroups)
print("Tabelas:", tables)
print("Total de queries:", total_queries)
