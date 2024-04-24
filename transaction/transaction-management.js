import sql from 'mssql'
import { obtainDb } from '../database-connection'

export async function obtainTransaction () {
  const db = await obtainDb()
  const transaction = db.transaction()
  await transaction.begin()
  return transaction
}

export function getOperations (transaction) {
  return transaction.isActive ? new sql.Request(transaction) : null
}

export async function closeTransaction (transaction, option) {
  if (option === 'commit') {
    await transaction.commit()
  } else if (option === 'rollback') {
    await transaction.rollback()
  }
  if (transaction.isActive) {
    await transaction.release()
  }
}

/**
 * Same system as the execute query function to retrieve data
 * @param {object} operations operations to which the transaction is linked
 * @param {string} query
 * @returns {object} Results as in execute query object
 */
export async function executeTransaction (operations, query) {
  const response = { success: false, data: [], rowCount: 0, error: null }
  try {
    const results = await operations.query(query)

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
