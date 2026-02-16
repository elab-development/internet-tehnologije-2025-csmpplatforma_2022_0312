/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};
exports.up = async function(knex) {
  if (!(await knex.schema.hasTable('grupa'))) {
    return knex.schema.createTable('grupa', function(table) {
      table.increments('grupaID').primary();
      table.string('naziv').notNullable();
      table.integer('godina');
      table.integer('nastavnikID').unsigned().references('nastavnikID').inTable('nastavnik');
      table.integer('sadrzajID').unsigned().references('sadrzajID').inTable('sadrzaj');
    });
  }
};
exports.down = (knex) => knex.schema.dropTableIfExists('grupa');