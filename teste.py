def find_table_keys(data):
    table_keys = []

    if isinstance(data, dict):
        for key, value in data.items():
            if key == "Table":
                table_keys.append(value)
            else:
                table_keys.extend(find_table_keys(value))
    elif isinstance(data, list):
        for item in data:
            table_keys.extend(find_table_keys(item))

    return table_keys

# Analisar o JSON retornado pelo Athena
athena_data = json.loads(json.dumps(athena_json))

# Encontrar todas as chaves 'TABLE' no JSON
table_values = find_table_keys(athena_data)

# Resultado
print(table_values)
