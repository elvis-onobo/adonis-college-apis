'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Course extends Model {
	instructors() {
		return this.hasMany('App/Models/Instructor')
	}

	departments() {
		return this.hasMany('App/Models/Departments')
	}

}

module.exports = Course
