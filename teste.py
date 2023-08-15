import sys
from awsglue.utils import getResolvedOptions

args = getResolvedOptions(sys.argv, ['errorPayload'])

error_payload = args['errorPayload']
print("Payload de erro recebido:", error_payload)
