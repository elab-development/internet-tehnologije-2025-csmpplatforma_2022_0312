module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      // Kada radiš lokalno, koristiće ove vrednosti ili Docker 'mysqldb'
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
        console.log('Knex se uspešno povezao na lokalnu bazu!');
        cb();
      }
    },
    migrations: {
      directory: './migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      // Ove vrednosti će Render povući iz Environment Variables koje ćemo podesiti
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false // Neophodno za Aiven MySQL konekciju
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    }
  }
};
