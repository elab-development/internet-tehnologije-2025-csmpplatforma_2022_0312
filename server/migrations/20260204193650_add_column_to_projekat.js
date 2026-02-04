/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasTable = await knex.schema.hasTable('projekat');
  
  if (hasTable) {
    const hasColumn = await knex.schema.hasColumn('projekat', 'odgovor');
    
    if (!hasColumn) {
      return knex.schema.table('projekat', function(table) {
        table.text('odgovor').nullable().after('opis');
      });
    }
  }
};

exports.down = function(knex) {
  return knex.schema.table('projekat', function(table) {
    table.dropColumn('odgovor');
  });
};
