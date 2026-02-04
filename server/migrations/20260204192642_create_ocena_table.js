/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  if (!(await knex.schema.hasTable('ocena'))) {
    return knex.schema.createTable('ocena', function(table) {
      table.increments('ocenaID').primary();
      table.integer('vrednost');
      table.string('komentar');
    });
  }
};
exports.down = (knex) => knex.schema.dropTableIfExists('ocena');
