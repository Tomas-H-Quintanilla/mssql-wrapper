import { obtainDb, releaseDb } from '../database-connection'

export async function executeQuery (query) {
  const db = await obtainDb()

  const response = { success: true, message: 'No errors' }
  try {
    const result = await db.query(query)
    response.rowCount = result.rowsAffected[0]
    response.data = []
    if (result.recordset !== undefined) {
      response.data = result.recordset
    }
  } catch (error) {
    const message = `Error executing query ${query}\n\n
                       Error found: ${error}`
    response.success = false
    response.message = message
  } finally {
    releaseDb(db)
  }

  return response
}
