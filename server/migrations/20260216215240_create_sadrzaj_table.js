/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  if (!(await knex.schema.hasTable('sadrzaj'))) {
    return knex.schema.createTable('sadrzaj', function(table) {
      table.increments('sadrzajID').primary();
      table.string('naziv').notNullable();
      table.string('tip');
      table.integer('maxPoena');
      table.string('pitanje');
      table.date('rok');
      table.integer('nastavnikID').unsigned().references('nastavnikID').inTable('nastavnik');
      
    });
  }
};
exports.down = (knex) => knex.schema.dropTableIfExists('sadrzaj');
