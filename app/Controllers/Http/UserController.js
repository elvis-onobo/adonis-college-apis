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


	/*
	 * @ Add user as instructor in a department
	 */
	async showAddUserAsIntructorForm({ view, params }) {
		const user = await User.find(params.id)
		const deps = await Department.all()

		return view.render('admin.add-instructor', { deps: deps.toJSON(), user: user.toJSON() })
	}

	async instructor({ request, response, params, session }) {
		const rules = {
			department_id: 'required|number'
		}

		const validation = await validateAll(request.all(), rules)

		if (validation.fails()) {
			session.withErrors(validation.messages()).flash()

			return response.redirect('back')
		}

		const ins = new Instructor()
		ins.user_id = params.id
		ins.department_id = request.input(['department_id'])

		if (await ins.save()) {
			session.flash({
				notification: {
					type: 'success',
					message: 'Instructor added'
				}
			})
			return response.redirect('back')
		} else {
			session.flash({
				notification: {
					type: 'error',
					message: 'Instructor not added'
				}
			})
			return response.redirect('back')
		}
	}

	/*
	 * @ Assign an instructor to a course
	 */
	async showAddInstructorToCourseForm({ view, params }) {
		const user = await User.find(params.id)
		const courses = await Course.all()

		return view.render('admin.add-instructor-course', { courses: courses.toJSON(), user: user.toJSON() })
	}

	async course({ request, response, params, session }) {
		const rules = {
			course_id: 'required|string'
		}

		const validation = await validateAll(request.all(), rules)

		if (validation.fails()) {
			session.withErrors(validation.messages()).flash()

			return response.redirect('back')
		}

		const course = await Course.find(request.input('course_id'))

		course.instructor_id = params.id

		if (course.save()) {
			session.flash({
				notification: {
					type: 'success',
					message: 'Instructor assigned to course'
				}
			})
			return response.redirect('back')
		} else {
			session.flash({
				notification: {
					type: 'error',
					message: 'Instructor not assigned to course'
				}
			})
			return response.redirect('back')
		}
	}

	// delete a user
	async deleteUser({ params, session, response }) {
		const { id } = params
		const user = await User.find(id)

		if (await user.delete()) {
			session.flash({
				notification: {
					type: 'success',
					message: 'User deleted!'
				}
			})
			return response.redirect('back')
		} else {
			session.flash({
				notification: {
					type: 'error',
					message: 'User could not be deleted!'
				}
			})
			return response.redirect('back')
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
