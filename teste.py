import boto3
from datetime import datetime

# Crie um cliente para o Step Functions
sfn_client = boto3.client('stepfunctions')

# Liste as state machines
state_machines = sfn_client.list_state_machines()

# Itere sobre as state machines e obtenha a última execução
for state_machine in state_machines['stateMachines']:
    state_machine_arn = state_machine['stateMachineArn']
    creation_date = state_machine['creationDate'].strftime('%Y-%m-%d')
    print(f"State Machine ARN: {state_machine_arn} - Data de Criação: {creation_date}")

    # Inicialize o contador de execuções e o token de próxima página
    total_executions = 0
    next_token = None
    last_execution = None

    # Itere através das páginas de execuções
    while True:
        if next_token:
            all_executions = sfn_client.list_executions(
                stateMachineArn=state_machine_arn,
                nextToken=next_token
            )
        else:
            all_executions = sfn_client.list_executions(
                stateMachineArn=state_machine_arn
            )

        total_executions += len(all_executions['executions'])

        # Se houver execuções e a última execução ainda não foi definida, obtenha a mais recente
        if all_executions['executions'] and last_execution is None:
            last_execution = all_executions['executions'][0]

        # Verifique se há mais páginas
        next_token = all_executions.get('nextToken')
        if not next_token:
            break

    print(f"Total de Execuções: {total_executions}")

    # Imprima detalhes da última execução, se houver
    if last_execution:
        last_execution_date = last_execution['startDate'].strftime('%Y-%m-%d')
        print(f"Última Execução: {last_execution['executionArn']} - Data: {last_execution_date} - Status: {last_execution['status']}")
    else:
        print("Sem execuções recentes.")
