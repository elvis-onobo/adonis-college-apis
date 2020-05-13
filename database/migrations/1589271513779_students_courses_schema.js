'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentsCoursesSchema extends Schema {
	up() {
		this.create('students_courses', (table) => {
			table.increments()
			table.integer('student_id')
			table.integer('course_id')
			table.timestamps()
		})
	}

	down() {
		this.drop('students_courses')
	}
}

module.exports = StudentsCoursesSchema
