'use strict'

/*
|--------------------------------------------------------------------------
| DepartmentSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class DepartmentSeeder {
	async run() {
		const departments = await Factory
			.model('App/Models/Department')
			.createMany(4)
	}
}

module.exports = DepartmentSeeder
