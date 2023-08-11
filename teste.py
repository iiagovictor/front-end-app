def validate_key(key):
    key = key.lower() # Converte a chave para minúsculas

    # Verifica o tipo do projeto
    if not re.match(r'^(run|temp|proj)_', key):
        return False, "Não especificado o tipo do projeto (RUN/PROJ/TEMP)"

    # Verifica o LUP
    if not re.match(r'^(run|temp|proj)_[a-z]{2}\d{4}_', key):
        return False, "LUP inválido"

    # Verifica o RACF, exceto para o tipo "run"
    if not re.match(r'^run_', key) and not re.match(r'^(temp|proj)_[a-z]{2}\d{4}_[a-z]{7}_', key):
        return False, "RACF inválida"

    # Verifica o nome do projeto
    match = re.match(r'^(run|temp|proj)_[a-z]{2}\d{4}_(?:[a-z]{7}_)?([a-zA-Z0-9]+)$', key)
    if match:
        project_name = match.group(2)
        if len(project_name) > 1:
            return True, ""
        else:
            return False, "Nome do recurso deve ter 2 caracteres no mínimo"
    else:
        return False, "Formato inválido"
