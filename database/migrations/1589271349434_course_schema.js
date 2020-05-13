'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CourseSchema extends Schema {
	up() {
		this.create('courses', (table) => {
			table.increments()
			table.integer('instructor_id').nullable()
			table.integer('department_id').notNullable()
			table.string('course_title', 50).notNullable()
			table.timestamps()
		})
	}

	down() {
		this.drop('courses')
	}
}

module.exports = CourseSchema
