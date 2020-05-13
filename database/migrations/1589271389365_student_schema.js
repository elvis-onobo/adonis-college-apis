'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentSchema extends Schema {
	up() {
		this.create('students', (table) => {
			table.increments()
			table.integer('user_id')
			table.integer('age').nullable()
			table.timestamps()
		})
	}

	down() {
		this.drop('students')
	}
}

module.exports = StudentSchema
