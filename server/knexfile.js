/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3307,        // Tvoj port iz phpMyAdmin-a
      user: 'root',      // XAMPP default
      password: '',      // XAMPP default
      database: 'csmp_baza' 
    },
    migrations: {
      directory: './migrations'
    }
  }
};
