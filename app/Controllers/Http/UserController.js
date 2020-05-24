'use strict'

const { validateAll, validate } = use('Validator')
const Department = use('App/Models/Department')
const Instructor = use('App/Models/Instructor')
const College = use('App/Models/College')
const Course = use('App/Models/Course')
const State = use('App/Models/State')
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Hash = use('Hash')
const Mail = use('Mail')

class UserController {
	/*
	 * @ Signup a user
	 */
	showSignupForm({ view }) {
		return view.render('signup')
	}

	async signup({ request, response, session }) {
		const rules = {
			firstname: 'required|string',
			lastname: 'required|string',
			email: 'required|email|unique:users,email',
			street: 'string',
			password: 'required'
		}

		const validation = await validateAll(request.all(), rules)

		if (validation.fails()) {
			session.withErrors(validation.messages()).flashExcept(['password'])

			return response.redirect('back')
		}

		// get data from form
		const userData = request.only(['firstname', 'lastname', 'email', 'street', 'role_id', 'state_id', 'password'])

		try {
			// save user in the db
			const user = await User.create(userData)

			// send confirmation mail
			// await Mail.send('emails.confirm_email', user.toJSON(), message => {
			// 	message.to(user.email)
			// 		.from('elvis@adonis.com')
			// 		.subject('Confirm Your Email Address')
			// })

			// display success message
			session.flash({
				notification: {
					type: 'success',
					message: 'Registration successful. Please confirm your email'
				}
			})

			return response.redirect('back')
		} catch (error) {
			session.flash({
				notification: {
					type: 'error',
					message: 'Registration failed'
				}
			})
			return response.redirect('back')
		}
	}

	/*
	 * @ Login user
	 */
	showLoginPage({ view }) {
		return view.render('login')
	}

	async login({ request, auth, response, session }) {
		const rules = {
			email: 'required|email',
			password: 'required'
		}

		const validation = await validateAll(request.all(), rules)

		if (validation.fails()) {
			session.withErrors(validation.messages()).flashExcept(['password'])

			return response.redirect('back')
		}

		const user = await User.query()
			.where('email', request.input('email'))
			.first()

		// verify password
		if (user) {
			const passwordVerified = await Hash.verify(request.input('password'), user.password)

			if (passwordVerified) {
				// login user
				await auth.remember(!!request.input('remember')).login(user)

				return response.route('home')
			}
		}

		// error case 
		session.flash({
			notification: {
				type: 'danger',
				message: 'Could not verify your credentials'
			}
		})

		return response.redirect('back')
	}

	/*
	 *@ Homepage
	 */
	showHomePage({ view }) {
		return view.render('home')
	}

	/*
	 * @ Enable users view their profile
	 */
	profile({ view }) {
		return view.render('profile')
	}

	// async profile({ auth, params, response }) {
	// 	if (auth.user.id !== Number(params.id)) {
	// 		return response.json({ status: 'You cannot view another user\'s profile' })
	// 	}
	// 	return response.json({
	// 		data: auth.user
	// 	})
	// }

	/*
	 * @ Get all users and display in a view
	 * @ Returns a view or JSON based on the request
	 */
	async getAllUsers({ view }) {
		const users = await User
			.query()
			.orderBy('id', 'desc')
			.paginate()

		return view.render('admin.users', { users: users.toJSON() })
	}

	/*
   * @ Get a single user
	 */
	async getOneUser({ params, view }) {
		const { id } = params
		const user = await User.find(id)

		return view.render('admin.single-user', { user: user.toJSON() })
	}

	/*
	 * @ Update a user's role
	 */
	async showUpdateRoleForm({ params, view }) {
		const roles = await Role.all()
		const user = await User.find(params.id)

		return view.render('admin.update-role', { roles: roles.toJSON(), user: user.toJSON() })
	}

	async updateUser({ request, response, session, params }) {
		const rules = {
			role_id: 'required'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({ message: validation.messages() })
		}

		const { id } = params

		const user = await User.find(id)

		// update user role
		user.role_id = request.input('role_id')

		if (user.save()) {
			session.flash({
				notification: {
					type: 'success',
					message: 'Role updated!'
				}
			})
			return response.redirect('back')
		} else {
			session.flash({
				notification: {
					type: 'error',
					message: 'Registration failed'
				}
			})
			return response.redirect('back')
		}
	}

	/*
	 * @ Create roles
	 */
	showCreateRolesForm({ view }) {
		return view.render('admin.create-roles')
	}

	async createRole({ request, session, response }) {
		const rules = {
			role: 'required|string'
		}

		const validation = await validateAll(request.all(), rules)

		if (validation.fails()) {
			session.withErrors(validation.messages())

			return response.redirect('back')
		}

		const role = new Role()
		role.role_label = request.input('role')

		if (await role.save()) {
			session.flash({
				notification: {
					type: 'success',
					message: 'Role Created!'
				}
			})
			return response.redirect('back')
		} else {
			session.flash({
				notification: {
					type: 'error',
					message: 'Failed to create role!'
				}
			})
			return response.redirect('back')
		}
	}

	/*
	 * @ Create a college 
	 */
	async showCreateCollegeForm({ view }) {
		const states = await State.all()

		return view.render('admin.create-college', { states: states.toJSON() })
	}

	async createCollege({ request, session, auth, response }) {
		const rules = {
			college: 'required|string',
			street: 'required|string'
		}

		const validation = await validateAll(request.all(), rules)

		if (validation.fails()) {
			session.withErrors(validation.messages()).flash()

			return response.redirect('back')
		}

		const college = new College()
		college.colleges_label = request.input('college')
		college.street = request.input('street')
		college.state_id = request.input('state')
		college.created_by = auth.user.id

		if (await college.save()) {
			session.flash({
				notification: {
					type: 'success',
					message: 'College Created!'
				}
			})
			return response.redirect('back')
		} else {
			session.flash({
				notification: {
					type: 'error',
					message: 'Failed to create college!'
				}
			})
			return response.redirect('back')
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

			session.flash({
				notification: {
					type: 'success',
					message: 'Role updated!'
				}
			})
			return response.redirect('back')
		} catch (error) {
			session.flash({
				notification: {
					type: 'success',
					message: 'Role updated!'
				}
			})
			return response.redirect('back')
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

	/*
	 * @ Logout User
	 */
	async logoutUser({ auth, response }) {
		await auth.logout()

		return response.redirect('/')
	}
}

module.exports = UserController
