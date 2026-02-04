/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  if (await knex.schema.hasTable('administrator')) {
    return knex.schema.table('administrator', function(table) {
      table.unique('kod');
    });
  }
};

exports.down = function(knex) {
  return knex.schema.table('administrator', function(table) {
    table.dropUnique('kod');
  });
};
