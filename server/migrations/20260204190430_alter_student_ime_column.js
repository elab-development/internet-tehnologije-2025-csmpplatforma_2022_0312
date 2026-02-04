/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('student', function(table) {
    table.string('ime', 150).notNullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.table('student', function(table) {
    table.string('ime', 80).alter();
  });
};
