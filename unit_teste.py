import boto3
import pytest
from unittest.mock import MagicMock, patch
from app import get_job_details

def test_get_job_details():
    # Criar um cliente do Glue falso para o mock
    glue_client_mock = MagicMock()

    # Configurar o retorno do método get_job_run()
    job_name = "test_job"
    run_id = "test_run_id"
    job_run_details = {
        "JobName": job_name,
        "JobRunId": run_id,
        "DatabaseName": "test_database"
    }
    glue_client_mock.get_job_run.return_value = job_run_details

    # Configurar o retorno do método get_table()
    table_name = "test_table"
    table_details = {"DatabaseName": job_run_details["DatabaseName"], "Name": table_name}
    glue_client_mock.get_table.return_value = table_details

    # Aplicar o mock ao boto3.client
    with patch("boto3.client") as boto3_client_mock:
        boto3_client_mock.return_value = glue_client_mock

        # Chamar a função que usa as chamadas get_job_run() e get_table()
        result = get_job_details(job_name, run_id, table_name)

        # Verificar se as chamadas get_job_run() e get_table() foram feitas corretamente
        assert result == table_details
