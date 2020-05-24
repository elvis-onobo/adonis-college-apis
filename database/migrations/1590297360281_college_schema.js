'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CollegeSchema extends Schema {
	up() {
		this.create('colleges', (table) => {
			table.increments()
			table.string('colleges_label', 50).notNullable()
			table.string('street', 150).notNullable()
			table.integer('state_id').nullable()
			table.integer('created_by').notNullable()
			table.timestamps()
		})
	}

	down() {
		this.drop('colleges')
	}
}

module.exports = CollegeSchema
