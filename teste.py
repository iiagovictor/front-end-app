import boto3

# Nome da função Lambda e o nome da variável de ambiente a ser atualizada
function_name = 'sua-funcao-lambda'
variable_name = 'NOME_DA_VARIAVEL_AMBIENTE'
new_value = 'NOVO_VALOR'

# Inicialize o cliente do AWS Lambda
lambda_client = boto3.client('lambda')

# Recupere a configuração atual da função Lambda
response = lambda_client.get_function_configuration(FunctionName=function_name)
current_environment = response['Environment']['Variables']

# Atualize a variável de ambiente com o novo valor
current_environment[variable_name] = new_value

# Atualize a configuração da função Lambda com a nova variável de ambiente
lambda_client.update_function_configuration(
    FunctionName=function_name,
    Environment={'Variables': current_environment}
)
