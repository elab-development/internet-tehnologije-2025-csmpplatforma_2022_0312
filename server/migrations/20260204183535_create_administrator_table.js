/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const exists = await knex.schema.hasTable('administrator');
  if(!exists){
    return knex.schema.createTable('administrator', function(table) {
    table.increments('adminID').primary();
    
    table.string('ime').notNullable();
    table.string('kod').notNullable();
  });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('administrator');
};
