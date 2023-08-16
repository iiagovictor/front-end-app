# ... [restante do código acima]

    # Convertendo os dados em uma lista de dicionários e removendo aspas extras
    lines = data.split("\n")
    results = [{line.split(",")[1].strip('"'): line.split(",")[0].strip('"')} for line in lines[1:] if line]  # Ignorando o cabeçalho e linhas vazias

# ... [restante do código abaixo]

# Exemplo de lista
lista = [{"uma": "valor1"}, {"outra": "valor2"}, {"uma": "valor3"}]

for l in lista:
    if next(iter(l)) == 'uma':
        print(l[next(iter(l))])
