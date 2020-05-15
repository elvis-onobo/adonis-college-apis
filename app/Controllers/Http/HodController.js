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

			// check if the HOD and course are from same department
			let hodObj = await Instructor.findBy('user_id', auth.user.id)
			const courseObj = await Course.find(id)

			if (Number(hodObj.department_id) !== Number(courseObj.department_id)) {
				return response.json({ status: 'You can\'t manipulate another department' })
			}

			// check if the user is actually an instructor
			const user = await User.find(request.input('instructor'))

			if (Number(user.role_id) !== 3 && Number(user.role_id) !== 4) {
				return response.json({ status: 'This user is not an instructor' })
			}

			const course = Course.find(id)
			// update the field
			course.instructor_id = request.input('instructor')

			course.save

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
	async destroyInstructor({ auth, params, response }) {
		try {
			const { id } = params //instructor ID

			// HOD and Instructor must be in same dept
			const hodObj = await Instructor.findBy('user_id', auth.user.id)
			const InstructorObj = await Instructor.findBy('user_id', id)

			if (Number(hodObj.department_id) !== Number(InstructorObj.department_id)) {
				return response.json({ status: 'Connot delete instructor in another department' })
			}

			const user = await Instructor.findBy('user_id', id)

			user.delete()

			return response.json({
				status: 'success',
			})
		} catch (error) {
			return error.message
			return response.status(400).json({
				status: 'error',
				message: 'User not found'
			})
		}
	}
}

module.exports = HodController
