'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async (faker) => {
	return {
		firstname: faker.name(),
		lastname: faker.last(),
		email: faker.email(),
		street: faker.address(),
		role_id: 1,
		state_id: 2,
		password: await Hash.make('password')
	}
})
