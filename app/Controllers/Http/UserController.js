'use strict'

const Department = use('App/Models/Department')
const Course = use('App/Models/Course')
const User = use('App/Models/User')

class UserController {
	// signs up the user
	async signup({ request, auth, response }) {
		// get data from form
		const userData = request.only(['firstname', 'lastname', 'email', 'street', 'role_id', 'state_id', 'password'])

		try {
			// save user in the db
			const user = await User.create(userData)
			// if user saved generate token for user
			const token = await auth.generate(user)

			return response.json({
				status: 'success',
				data: token
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Failed to create user'
			})
		}
	}

	// logs in a user
	async login({ request, auth, response }) {
		try {
			// validate the user credentials and generate JWT token
			const token = await auth.attempt(
				request.input('email'),
				request.input('password')
			)

			return response.json({
				status: 'success',
				data: token
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Invalid email or password'
			})
		}
	}

	// admin can update a user to student(2) or instructor(3)
	async updateUser({ params, request, response }) {
		try {
			const { id } = params

			await User.query()
				.where('id', id)
				.update({ role_id: request.input('role') })

			return response.json({
				status: 'success',
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Failed to update.'
			})
		}
	}

	// admin can create a department
	async department({ request, response }) {
		// data from the department form
		const depData = request.only(['colleges_id', 'dep_label'])

		try {
			// save department in the db
			const dep = await Department.create(depData)

			return response.json({
				status: 'success',
				data: dep
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Failed to create department.'
			})
		}
	}

	//admin can create a course
	async course({ request, response }) {
		// data from the department form
		const courseData = request.only(['instructor_id', 'department_id', 'course_title'])

		try {
			// save department in the db
			const course = await Course.create(courseData)

			return response.json({
				status: 'success',
				data: course
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Failed to create department.'
			})
		}
	}
}

module.exports = UserController
