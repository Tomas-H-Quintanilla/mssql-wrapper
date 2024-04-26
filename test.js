const {  Database, getConnection ,executeQuery, releaseConnection, getTransaction, getTransactionRequest, executeTransaction, releaseTransaction } = require(".");
const { config } = require("./config");
function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }


async function performTests(){
    const database=new Database(config)

    const connection = await getConnection()

    assert(connection.connected,'ERROR: Connection failed')
    const queryResult=await executeQuery(`SELECT @@VERSION AS 'SQL Server Version'`);

    assert(queryResult.rowCount==1 && queryResult.success,'ERROR: Query failed.')

    const transaction = await getTransaction()

    assert(transaction._acquiredConnection !== undefined,'ERROR: Transaction is not active')

    const request =await getTransactionRequest(transaction)

    const transactionResults= await executeTransaction(request,`SELECT @@VERSION AS 'SQL Server Version'`)
    assert(transactionResults.rowCount==1 && transactionResults.success,'ERROR: Transaction has not been successfully executed')

    await releaseTransaction(transaction,'commit')
    assert(transaction._acquiredConnection !== undefined,'ERROR: Transaction is still active')


    const responseRelease = await releaseConnection(connection)
    assert(responseRelease === 'success','ERROR: Connection is still active')

    const responseDisconnect = await database.disconnect()
    assert(responseDisconnect === 'success','ERROR: Pool could not be released.')

    return 'success'
}


performTests().then(response=>console.log(response)).catch(error => console.error(error.message));