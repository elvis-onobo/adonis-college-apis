'use strict'

const { validateAll, validate } = use('Validator')
const StudentsCourse = use('App/Models/StudentsCourse')
const Department = use('App/Models/Department')
const Course = use('App/Models/Course')
const User = use('App/Models/User')

class StudentController {

	/*
	 * @ Get all courses, add courses and delete courses
	 */
	async showAllCourses({ view, params }) {
		// getting the courses for a particular user
		let course = await User.find(params.id)
		const courses = await course.courses().fetch()

		return view.render('student.student-courses', { courses: courses.toJSON() })
	}

	async showAddCourseForm({ view }) {
		const courses = await Course.all()

		return view.render('student.add-student-course', { courses: courses.toJSON() })
	}

	async addCourse({ request, response, params, session }) {
		const rules = {
			course_id: 'required|number'
		}

		const validation = await validateAll(request.all(), rules)

		if (validation.fails()) {
			session.withErrors(validation.messages()).flash()

			return response.redirect('back')
		}

		const course = await new StudentsCourse()
		course.student_id = params.id
		course.course_id = request.input(['course_id'])

		if (await course.save()) {
			session.flash({
				notification: {
					type: 'success',
					message: 'Course Added!'
				}
			})
			return response.redirect('back')
		} else {
			session.flash({
				notification: {
					type: 'success',
					message: 'Course Not Added'
				}
			})
			return response.redirect('back')
		}
	}


	// delete a course
	async destroy({ params, response, session }) {
		const { id } = params
		const course = await StudentsCourse.find(id)

		if (course.delete()) {
			session.flash({
				notification: {
					type: 'success',
					message: 'Course Deleted!'
				}
			})
			return response.redirect('back')
		} else {
			session.flash({
				notification: {
					type: 'error',
					message: 'Failed to delete course!'
				}
			})
			return response.redirect('back')
		}
	}
}

module.exports = StudentController
