import re

def extract_databases_and_tables(query):
    pattern = r'(?:FROM|INTO|UPDATE|JOIN)\s+([^\s.]+)(?:\.[^\s.]+)?\.([^\s.;]+)'
    matches = re.findall(pattern, query)
    
    results = []
    for match in matches:
        database, table = match
        results.append((database, table))
    
    return results

# Exemplo de uso
query = """SELECT * FROM my_database.my_schema.my_table 
           JOIN another_database.another_schema.another_table 
           ON my_table.id = another_table.id WHERE my_table.id = 5;"""

tables = extract_databases_and_tables(query)

if tables:
    for database, table in tables:
        print(f"Database: {database}")
        print(f"Table: {table}")
else:
    print("Databases and tables not found in the query.")
