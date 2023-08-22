def list_available_workgroups():
    # Criar um cliente para o Athena
    client = boto3.client('athena')
    
    # Lista para armazenar os workgroups
    workgroups = []
    
    # Obter a lista de workgroups
    response = client.list_work_groups()
    
    for workgroup in response['WorkGroups']:
        workgroups.append(workgroup['Name'])
    
    return workgroups
