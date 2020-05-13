'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InstructorSchema extends Schema {
	up() {
		this.create('instructors', (table) => {
			table.increments()
			table.integer('user_id')
			table.integer('department_id')
			table.timestamps()
		})
	}

	down() {
		this.drop('instructors')
	}
}

module.exports = InstructorSchema
