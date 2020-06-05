'use strict'

const Department = use('App/Models/Department')
const Instructor = use('App/Models/Instructor')
const Course = use('App/Models/Course')
const User = use('App/Models/User')
const { validate, validateAll } = use('Validator')

class UserController {

	// signs up the user
	async signup({ request, auth, response }) {
		const rules = {
			firstname: 'required|string',
			lastname: 'required|string',
			email: 'required|email|unique:users,email',
			password: 'required'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({ message: validation.messages() })
		}

		// get data from form
		const userData = request.only(['firstname', 'lastname', 'email', 'street', 'role_id', 'state_id', 'password'])

		try {
			// save user in the db
			const user = await User.create(userData)
			// if user saved generate token for user
			const token = await auth.generate(user)

			return response.status(200).json({
				status: 'success',
				data: token
			})
			// this.sendSuccess(token)
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Failed to create user'
			})
		}
	}

	// logs in a user
	async login({ request, auth, response }) {
		const rules = {
			email: 'required|email',
			password: 'required'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({ message: validation.messages() })
		}

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

	// users can view their profile
	async profile({ auth, params, response }) {
		const { id } = await auth.getUser()

		if (id !== Number(params.id)) {
			return response.json({ status: 'You cannot view another user\'s profile' })
		}

		return response.json({
			data: auth.user
		})
	}

	// admin can update a user to student(2), instructor(3) or HOD(4)
	async updateUser({ params, request, response }) {
		const rules = {
			role: 'required'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({ message: validation.messages() })
		}

		try {
			const { id } = params

			const user = await User.find(id)

			// update user role
			user.role_id = request.input('role')

			user.save()

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
		const rules = {
			colleges_id: 'required|number',
			dep_label: 'required|string'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({ message: validation.messages() })
		}


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

	// admin can add a user as instructor in a department
	async instructor({ request, response }) {
		const rules = {
			user_id: 'required|number',
			department_id: 'required|number'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({ message: validation.messages() })
		}


		// data from the department form
		const data = request.only(['user_id', 'department_id'])

		try {
			// save department in the db
			const result = await Instructor.create(data)

			return response.json({
				status: 'success',
				data: result
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Failed to log user as instructor.'
			})
		}
	}

	//admin can create a course
	async course({ request, response }) {
		const rules = {
			department_id: 'required|number',
			course_title: 'required|string'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({ message: validation.messages() })
		}

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

	// admin can get all users
	async getAllUsers({ response }) {
		try {
			const users = await User.query().paginate(20)

			return response.json({
				status: 'success',
				data: users
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Could not fetch users.'
			})
		}
	}

	// admin can fetch one user
	async getOneUser({ params, response }) {
		try {
			const { id } = params
			const user = await User.find(id)

			return response.json({
				status: 'success',
				data: user
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'User not found.'
			})
		}
	}

	// delete a user
	async deleteUser({ params, response }) {
		try {
			const { id } = params
			const user = await User.find(id)

			await user.delete()

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

module.exports = UserController
