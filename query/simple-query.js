const { getConnection, releaseConnection } = require("../database-connection")


/**
 * Admits any SQL query and returns an object that contains:
 * - success: Query was successfully executed
 * - message: Message of whether the query had errors
 * - data: Array cointaining the recordset obtained from he query
 * - rowCount: Number of rows affected by the query
 * - error: Error encountered during the execution of the query
 * - query: Query performed
 * - timeStart: Timestamp in milliseconds when the query was started
 * - timeEnd: Timestamp in milliseconds when the query was finished
 * - executionTime: Time needed to execute the query
 * @param {string} query: Valid SQL query. No characters will be scaped
 * @returns {Object}:  { success, message, data, rowCount, error, query, timeStart, timeEnd, executionTime }
 */
 async function executeQuery (query) {
  const connection = await getConnection()

  const response = { success: true, message: 'No errors', data: [], rowCount: 0, error: null, query, timeStart: new Date().getTime() }
  try {
    const result = await connection.query(query)
    response.rowCount = result.rowsAffected[0]
    if (result.recordset !== undefined) {
      response.data = result.recordset
    }
  } catch (error) {
    response.success = false
    response.message = `Error executing query ${query}`
    response.error = error
  } finally {
    releaseConnection(connection)
  }
  response.timeEnd = new Date().getTime()
  response.executionTime = response.timeEnd - response.timeStart

  return response
}

module.exports={executeQuery}