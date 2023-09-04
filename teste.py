import boto3

def copy_between_buckets(source_bucket, source_key, dest_bucket, dest_key):
    s3 = boto3.resource('s3')
    
    # Crie uma referência ao objeto que você deseja copiar
    copy_source = {
        'Bucket': source_bucket,
        'Key': source_key
    }
    
    # Use o método copy para copiar o objeto para o novo destino
    s3.Bucket(dest_bucket).copy(copy_source, dest_key)
    print(f"Copied {source_key} from {source_bucket} to {dest_key} in {dest_bucket}")

# Exemplo de uso:
copy_between_buckets('source-bucket-name', 'path/in/source/file', 'dest-bucket-name', 'path/in/dest/file')
