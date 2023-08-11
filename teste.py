def validate_key(key):
    key = key.lower() # Converte a chave para minúsculas
    pattern = r'^(run|temp|proj)_xx\d{4}_[a-z]{7}_([a-zA-Z0-9]+)$'
    match = re.match(pattern, key)
    
    if match:
        project_name = match.group(2)
        if len(project_name) >= 1:
            return True
    return False
