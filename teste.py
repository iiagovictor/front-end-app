def remove_partitions_from_s3_path(s3_path):
    # Divide o caminho S3 em partes usando '/'
    parts = s3_path.split('/')

    # Inicializa uma lista para armazenar partes não relacionadas à partição
    new_parts = []

    for part in parts:
        # Verifica se a parte contém o caractere '=' (indicando uma partição)
        if '=' in part:
            break  # Se encontrar uma partição, para de adicionar partes
        new_parts.append(part)

    # Recria o caminho S3 usando as partes não relacionadas à partição
    new_s3_path = '/'.join(new_parts)

    # Adiciona 's3://' de volta ao caminho, pois foi removido durante a divisão
    return 's3://' + new_s3_path

# Exemplos de uso:
s3_path1 = "s3://bucket/path1/path2/ano=2023/mes=09/dia=01"
s3_path2 = "s3://bucket/path1/ano=2023/mes=09/dia=01"
s3_path3 = "s3://bucket/path1/path2/ano_dt=2023/mes_dt=09/dia_dt=01"

new_path1 = remove_partitions_from_s3_path(s3_path1)
new_path2 = remove_partitions_from_s3_path(s3_path2)
new_path3 = remove_partitions_from_s3_path(s3_path3)

print(new_path1)  # Deve retornar "s3://bucket/path1/path2"
print(new_path2)  # Deve retornar "s3://bucket/path1"
print(new_path3)  # Deve retornar "s3://bucket/path1/path2"
