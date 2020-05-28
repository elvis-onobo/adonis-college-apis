'use strict'

const Instructor = use('App/Models/Instructor')
const Course = use('App/Models/Course')

class InstructorController {
	async courses({ params, auth, response, session, view }) {
		const { id } = params //instructorID

		if (auth.user.id !== Number(params.id)) {
			session.flash({
				notification: {
					type: 'success',
					message: 'Instructor assigned to course'
				}
			})
			return response.redirect('back')
		}

		const courses = await Course.query()
			.where('instructor_id', id)
			.fetch()

		return view.render('instructor.all-courses', { courses: courses.toJSON() })
	}
}

module.exports = InstructorController
