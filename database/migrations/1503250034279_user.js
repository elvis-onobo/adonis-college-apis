'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
	up() {
		this.create('users', (table) => {
			table.increments()
			table.string('firstname', 100).notNullable()
			table.string('lastname', 100).notNullable()
			table.string('email', 100).notNullable().unique()
			table.string('street', 100).notNullable()
			table.integer('role_id').unsigned().notNullable()
			table.integer('state_id').unsigned().notNullable()
			table.string('password', 60).notNullable()
			table.timestamps()
		})
	}

	down() {
		this.drop('users')
	}
}

module.exports = UserSchema
