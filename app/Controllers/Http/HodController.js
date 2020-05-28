'use strict'

const { validateAll } = use('Validator')
const Instructor = use('App/Models/Instructor')
const Course = use('App/Models/Course')
const User = use('App/Models/User')
const Database = use('Database')

class HodController {
	/*
	* @ Get all instructors and assign to a course
	*/
	async getAllInstructors({ view }) {
		const instructors = await Database
			.select('*')
			.from('users')
			.rightJoin('instructors', 'users.id', 'instructors.user_id')

		return view.render('hod.list-of-instructors', { instructors })
	}

	async showAddInstructorToCourseForm({ view, params }) {
		const user = await User.find(params.id)
		const courses = await Course.all()

		return view.render('hod.add-instructor-course', { courses: courses.toJSON(), user: user.toJSON() })
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

	async destroyInstructor({ auth, params, response, session }) {
		const { id } = params //instructor ID

		// HOD and Instructor must be in same dept
		if (auth.user.role_id === 4) {
			session.flash({
				notification: {
					type: 'error',
					message: 'Only HODs can delete an instructor'
				}
			})
			return response.redirect('back')
		}

		const user = await Instructor.findBy('user_id', id)

		user.delete()

		if (user.delete()) {
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
					message: 'Failed to delete'
				}
			})
			return response.redirect('back')
		}
	}
}

module.exports = HodController