module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'mysqldb', 
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'csmp_baza'
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: (conn, cb) => {
        console.log('Knex se uspešno povezao na bazu!');
        cb();
      }
    },
    migrations: {
      directory: './migrations'
    }
  }
};
