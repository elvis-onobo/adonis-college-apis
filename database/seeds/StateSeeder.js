'use strict'

/*
|--------------------------------------------------------------------------
| StateSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class StateSeeder {
	async run() {
		const states = await Factory
			.model('App/Models/State')
			.createMany(5)
	}
}

module.exports = StateSeeder
