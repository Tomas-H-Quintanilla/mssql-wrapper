const sql = require('mssql')

class Database {
  /**
     * Singleton to keep the connection a mssql database open
     * and prevent the need of having a single object that needs to be carried
     * @param {object} config: Configuration settings for a pool in mssql
     * @returns
     */
  constructor (config = null) {
    if (!Database.instance && config !== null) {
      this.pool = new sql.ConnectionPool({ ...config })
      this.connection = null
      Database.instance = this
    }
    return Database.instance
  }

  /**
   * Provides the connection to the pool, needs the Database class instantianted
   * @returns {Promise}: Connection to the pool
   */
  async connect () {
    try {
      if (this.connection === null) {
        this.connection = this.pool.connect()
      }
      return this.connection
    } catch (error) {
      return error
    }
  }

  /**
   * Closes the connection to the pool
   * @returns {Promise}: Either Success or an error message
   */
  async disconnect () {
    try {
      if (this.connection === null) {
        this.connection.close()
      }
      return 'success'
    } catch (error) {
      return error
    }
  }
}

/**
 * Checks if the connection is active and releases it
 * @param {object} connection: database connection
 */
async function releaseConnection (connection) {
  if (connection) {
    await connection.release()
    return 'success'
  }
  return 'ERROR: Connection is not active'
}

/**
 * Returns the connection to the pool
 * @returns {Promise}: Connection to the pool
 */
async function getConnection () {
  const database = new Database()
  const connection = database.connect()
  return connection
}

module.exports={getConnection,Database,releaseConnection}