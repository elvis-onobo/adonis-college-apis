'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepartmentSchema extends Schema {
	up() {
		this.create('departments', (table) => {
			table.increments()
			table.integer('colleges_id')
			table.string('dep_label', 50).notNullable()
			table.timestamps()
		})
	}

	down() {
		this.drop('departments')
	}
}

module.exports = DepartmentSchema
