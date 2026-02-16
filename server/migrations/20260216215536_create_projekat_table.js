/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('projekat', function(table) {
    table.increments('projekatID').primary(); 
    table.string('naziv').notNullable();
    table.string('opis');
    table.string('odgovor');
    
    table.integer('studentID').unsigned().notNullable();
    table.foreign('studentID')
         .references('studentID')
         .inTable('student')
         .onDelete('CASCADE'); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('projekat');
};
