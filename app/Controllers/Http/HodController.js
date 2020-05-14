'use strict'

const Department = use('App/Models/Department')
const Instructor = use('App/Models/Instructor')
const Course = use('App/Models/Course')
const User = use('App/Models/User')
const Database = use('Database')

class HodController {
	// assign an instructor to a course
	async courseIntructor({ auth, params, request, response }) {
		try {
			const { id } = params //course ID

			// check if the HOD belongs to that department from the instructors table
			const hodId = await Database
				.table('instructors')
				.where('user_id', auth.user.id)
				.first()

			if (auth.user.id !== Number(hodId.user_id)) {
				return response.json({ status: 'You can\'t manipulate another department' })
			}

			const course = await Database
				.table('courses')
				.where('id', id)
				.update({ instructor_id: request.input('instructor') })

			return response.json({
				status: 'success',
				data: course
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Failed to add instructor to course.'
			})
		}
	}

	// delete an instructor from the dept
	async destroyInstructor({ params, response }) {
		try {
			const { id } = params
			const user = await Instructor
				.query()
				.where('user_id', id)
				.delete()

			return response.json({
				status: 'success',
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'User not found'
			})
		}
	}
}

module.exports = HodController
