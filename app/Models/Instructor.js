'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Instructor extends Model {
	users() {
		return this.hasMany('App/Models/User')
	}

	departments() {
		return this.hasMany('App/Models/Departments')
	}
}

module.exports = Instructor
