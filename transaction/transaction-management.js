const sql = require('mssql')
const { getConnection } = require('../database-connection')


/**
 * Creates a transaction, starts it and returns it to the user
 * @returns {object}: Transaction to the user
 */
async function getTransaction () {
  const connection = await getConnection()
  const transaction = connection.transaction()


  await transaction.begin()
  transaction.isActive = true
  return transaction
}


/**
 * Closes and releases the transaction
 * @param {object} transaction: transacion to be released
 * @param {string} option: commit or rollback
 */
async function releaseTransaction (transaction, option) {
  if (option === 'commit') {
    await transaction.commit()
  } else if (option === 'rollback') {
    await transaction.rollback()
  }
  if (transaction.isActive) {
    await transaction.release()
    transaction.isActive = false

  }
}

/**
 * Creates an sql request for the transaction
 * @param {object} transaction
 * @returns {object}
 */
function getTransactionRequest (transaction) {
  return transaction.isActive ? new sql.Request(transaction) : null
}


/**
 * Amits any SQL query and an operation set and returns an object that contains:
 * - success: Query was successfully executed
 * - message: Message of whether the query had errors
 * - data: Array cointaining the recordset obtained from he query
 * - rowCount: Number of rows affected by the query
 * - error: Error encountered during the execution of the query
 * - query: Query performed
 * - timeStart: Timestamp in milliseconds when the query was started
 * - timeEnd: Timestamp in milliseconds when the query was finished
 * - executionTime: Time needed to execute the query
 * @param {object} request in order to execute the transaction query
 * @param {string} query Valid SQL query. No characters will be scaped
 * @returns {object} Results as in execute query object
 */
async function executeTransaction (request, query) {
  const response = { success: false, data: [], rowCount: 0, error: null }
  try {
    const results = await request.query(query)

    response.rowCount = results.rowsAffected[0]
    response.data = results.recordsets === undefined ? [] : results.recordsets[0]
    response.success = true
  } catch (error) {
    const message = `Error executing query ${query}\n\n
                       Error found: ${error}`
    response.success = false
    response.message = message
  }
  return response
}

module.exports={executeTransaction,getTransaction,releaseTransaction,getTransactionRequest}