
const config = {
    user: 'node',
    password: 'Neteris2023@',
    server: '10.14.64.200',
    database:'TESTDB',
    port: 1433,
    pool: {
      max: 15,
      min: 1,
      idleTimeoutMillis: 300000
    },
    options: {
      trustServerCertificate: true
    }
};

module.exports ={config}