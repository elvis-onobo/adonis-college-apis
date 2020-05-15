'use strict'

const Instructor = use('App/Models/Instructor')
const Course = use('App/Models/Course')

class InstructorController {
	async courses({ params, auth, response }) {
		try {
			const { id } = params

			if (auth.user.id !== Number(params.id)) {
				return response.json({ status: 'You can only see courses assigned to you' })
			}

			const users = await Course.findBy('instructor_id', id)

			return response.json({
				status: 'success',
				data: users
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Could not fetch courses.'
			})
		}

	}
}

module.exports = InstructorController
