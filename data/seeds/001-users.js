exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'Bob', password: '1234'},
        {username: 'Tom', password: '1234'},
        {username: 'Mot', password: '1234'}
      ]);
    });
};