const sql = require('mssql')

export class Database {
  constructor (config = null) {
    if (!Database.instance && config !== null) {
      this.pool = new sql.ConnectionPool({ ...config })
      this.db = null
      Database.instance = this
    }
    return Database.instance
  }

  async connect () {
    try {
      if (this.db === null) {
        this.db = await this.pool.connect()
      }
      return this.db
    } catch (error) {
      return error
    }
  }
}

export async function releaseDb (db) {
  if (db) {
    await db.release()
  }
}

export async function obtainDb () {
  const database = new Database()
  const db = await database.connect()
  return db
}
