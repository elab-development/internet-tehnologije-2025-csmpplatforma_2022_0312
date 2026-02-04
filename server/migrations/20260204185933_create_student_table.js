/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const exists = await knex.schema.hasTable('student');
    if (!exists){
        return knex.schema.createTable('student', function(table) {
        table.increments('studentID').primary();
        table.string('ime').notNullable();
        table.string('prezime').notNullable();
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
        
        
        table.integer('adminID').unsigned()
            .references('adminID').inTable('administrator')
            .onDelete('SET NULL');
            
        table.integer('grupaID').unsigned()
            .references('grupaID').inTable('grupa')
            .onDelete('SET NULL');
  });

}
    
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('student');
};
