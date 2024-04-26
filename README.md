# mssql-wrapper

Simplified wrapper for mssql in Nodejs. This library tries to extend the functionalities offered by the library mssql.

In the official documentation they recommend creating a singleton class to handle the connection to the pool, this small repository does that for you and lets you query the database without the need of having to instantiate the pool every time. This is a complement to the mssql library, so all the other functionalities of the library are still available.

## Create the connection to the pool

In order to create the connection to the pool you must instantiate the `Database` class with the configuration to the pool. The same configuration file used for the parent library `mssql` can be used for this wrapper:

```javascript
const config = {
                user: config.DB_USER,
                password: config.DB_PASSWORD,
                server: config.DB_SERVER,
                database: config.DATABASE,
                pool: config.DB_POOL,
                options: {
                trustServerCertificate: true
                }
                }
new Database(config)
```

For later connecitons to the database is not necessary to pass the configuration file, you can create them by doing the following:

```javascript
const connection = await getConnection()
```

This `connection` object will allow you to query the database as in the `mssql` library, but wrappers for the query functions have also been added to this library.

You can releaseConnection the connection by using the following function:

```javascript
releaseConnection(connection) 
```

## Query wrappers

#### **To use this functionalities you need to have instantiated the database as described in the previous step.**

### Execute queries

The function `executeQuery` allows the user to execute any SQL query, but it does not escape special characters. 

```javascript
const results = await executeQuery('SELECT * FROM table');
```


Once executed the user is returned an object containing the following properties fr any SQL query:

```javascript
{   success: boolean, 
    message: string, 
    data: list, 
    rowCount: int, 
    error: string, 
    query:string, 
    timeStart: int,
    timeEnd: int,
    executionTime: int
}
```
### Execute transactions

This library also contains a wrapper for transactions. In order to obtain a transaction object to execute the queries on with the following function:

```javascript
const transaction = getTransaction()
```

In addition to the usual things that the transaction object has, this one has an attribute called `isActive` that indicates whether the transaction has been started or not.

In order to close the transaction, you can call the following function, with either `commit` or `rollback` as the second argument `option`:

```javascript
closeTransaction(transaction,option)
```

To execute queries within a transaction you need a query object which can be instantiated with the following function:

```javascript
const transactionRequest = getRequest(transaction) 
```

Once you have this object you can execute queries and retrieve data with the same format as with `executeQuery` with the following function:

```javascript
const results = await executeTransaction (request, query);
```

Further operations to be added!