/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('projekat', function(table) {
    
    table.specificType('pdf_data', 'LONGBLOB').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('projekat', function(table) {
    table.dropColumn('pdf_data');
  });
};
