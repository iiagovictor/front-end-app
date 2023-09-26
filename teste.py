 Carregar o JSON
data = json.loads(json_data)

# Função para percorrer o plano lógico e extrair informações
def extract_lineage(node, lineage=None):
    if lineage is None:
        lineage = []

    if "name" in node and "outputs" in node:
        operation_name = node["name"]
        outputs = node["outputs"]
        lineage.append({"operation": operation_name, "outputs": outputs})

    if "children" in node:
        for child in node["children"]:
            extract_lineage(child, lineage)

    return lineage

# Percorrer os fragmentos e extrair o lineage
lineage_data = []
for fragment in data["fragments"]:
    logical_plan = fragment["logicalPlan"]
    lineage = extract_lineage(logical_plan)
    lineage_data.append({"id": fragment["id"], "lineage": lineage})

# Imprimir o resultado
for item in lineage_data:
    print(f"Fragment ID: {item['id']}")
    for operation in item["lineage"]:
        print(f"Operation: {operation['operation']}")
        print(f"Outputs: {', '.join(operation['outputs'])}")
    print()
