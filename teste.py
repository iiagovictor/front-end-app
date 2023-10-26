def extrair_tabelas(dict_data):
  """
  Extrai todas as chaves 'table' de um DICT.

  Args:
    dict_data: O DICT a ser processado.

  Returns:
    Uma lista com todas as chaves 'table' encontradas.
  """

  # Criar uma lista para armazenar as chaves 'table'
  tabelas = []

  # Iterar recursivamente sobre o DICT
  def iterar(dict_data):
    # Verificar se a chave atual é igual a 'table'
    if dict_data.get("table"):
      # Adicionar a chave à lista de resultados
      tabelas.append(dict_data["table"])

    # Iterar recursivamente sobre cada valor do DICT
    for key, value in dict_data.items():
      if isinstance(value, dict):
        iterar(value)

  # Chamar a função iterar recursivamente para processar o DICT
  iterar(dict_data)

  # Retornar a lista de resultados
  return tabelas
