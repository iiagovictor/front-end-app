import re

def validate_resource_name(key):
    key = key.lower()

    if not re.match(r'^(run|temp|proj)_', key):
        return False, 'delete', 'Não especificado o tipo do projeto (RUN/PROJ/TEMP)'

    if not re.match(r'^(run|temp|proj)_[a-z]{2}\d{4}_', key):
        return False, 'delete', 'LUP inválido'

    if not re.match(r'^(run)_', key) and not re.match(r'^(temp|proj)_[a-z]{2}\d{4}_[a-z]{7}_', key):
        return False, 'delete', 'RACF inválido'

    match = re.match(r'^(run|temp|proj)_[a-z]{2}\d{4}_(?:[a-z]{7}_)?([\w\s]+)$', key)
    if match:
        project_name = match.group(2)
        if len(project_name) >= 1:
            return True, 'keep', ''
        else:
            return False, 'delete', 'Nome do recurso deve ter 1 caracter no mínimo'
    else:
        return False, 'delete', 'Formato inválido'

# Teste
keys = [
    "run_ab1234_project name",
    "temp_ab1234_username_project name with spaces",
    "proj_ab1234_project-name",
    "proj_ab1234_username_project name"
]

for s in keys:
    valid, action, reason = validate_resource_name(s)
    if valid:
        print(f"'{s}' é válido")
    else:
        print(f"'{s}' é inválido - {reason}")
