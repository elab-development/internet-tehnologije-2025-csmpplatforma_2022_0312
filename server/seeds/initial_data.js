/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('predaja').del();
  await knex('projekat').del();
  await knex('student').del();
  await knex('grupa').del();
  await knex('sadrzaj').del();
  await knex('nastavnik').del();
  await knex('administrator').del();

  await knex('administrator').insert([
    { adminID: 1, ime: 'Pera Peric', kod: 'pera123' }
  ]);
};