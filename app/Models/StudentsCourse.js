'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StudentsCourse extends Model {
	courses() {
		return this.hasMany('App/Models/Course', 'id', 'id')
	}

	students() {
		return this.hasMany('App/Models/User', 'id', 'student_id')
	}
}

module.exports = StudentsCourse
