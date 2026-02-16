/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  if (!(await knex.schema.hasTable('predaja'))) {
    return knex.schema.createTable('predaja', function(table) {
      table.increments('predajaID').unsigned(); 
      
      table.integer('studentID').unsigned().notNullable();
      table.integer('sadrzajID').unsigned().notNullable();
      table.text('sadrzajRada'); 
      table.date('datumPredaje');
 
      table.integer('ocenaID').unsigned().nullable()
        .references('ocenaID').inTable('ocena')
        .onDelete('SET NULL'); 

      table.primary(['predajaID', 'studentID', 'sadrzajID']);

      table.foreign('studentID').references('studentID').inTable('student');
      table.foreign('sadrzajID').references('sadrzajID').inTable('sadrzaj');
    });
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('predaja');
