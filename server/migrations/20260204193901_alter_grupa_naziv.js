/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  if (await knex.schema.hasTable('grupa')) {
    return knex.schema.table('grupa', function(table) {
      table.string('naziv', 150).notNullable().alter();
    });
  }
};
exports.down = function(knex) {
  return knex.schema.table('grupa', function(table) {
    table.string('naziv', 255).nullable().alter();
  });
};
