import boto3

# Crie um cliente para o Step Functions
sfn_client = boto3.client('stepfunctions')

# Liste as state machines
state_machines = sfn_client.list_state_machines()

# Itere sobre as state machines e obtenha a última execução
for state_machine in state_machines['stateMachines']:
    state_machine_arn = state_machine['stateMachineArn']
    print(f"State Machine ARN: {state_machine_arn}")

    # Liste as execuções para esta state machine
    executions = sfn_client.list_executions(
        stateMachineArn=state_machine_arn,
        statusFilter='RUNNING'
    )

    # Se houver execuções, obtenha a mais recente
    if executions['executions']:
        last_execution = executions['executions'][0]
        last_execution_date = last_execution['startDate']
        print(f"Última Execução: {last_execution['executionArn']} - Data: {last_execution_date} - Status: {last_execution['status']}")
    else:
        print("Sem execuções recentes.")
