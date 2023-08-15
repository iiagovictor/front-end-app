import boto3
import sys

# Baixar common_functions.py do S3
s3_resource = boto3.resource('s3')
s3_resource.Bucket('your-bucket-name').download_file('path/to/common_functions.py', '/tmp/common_functions.py')

# Importando funções do arquivo common_functions.py
sys.path.append('/tmp')
import common_functions as cf

# Continuação do seu código...
