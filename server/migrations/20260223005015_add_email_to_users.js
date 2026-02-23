exports.up = function(knex) {
  return knex.schema
    .table('student', table => {
      table.string('email').nullable(); 
    })
    .table('nastavnik', table => {
      table.string('email').nullable(); 
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('student', table => {
      table.dropColumn('email');
    })
    .table('nastavnik', table => {
      table.dropColumn('email');
    });
};