SELECT *
FROM default.system.query_history
WHERE date_diff('day', from_iso8601_timestamp(query_execution_time), current_timestamp) <= 30
AND workgroup = 'NOME_DO_SEU_WORKGROUP'
ORDER BY query_execution_time DESC;
