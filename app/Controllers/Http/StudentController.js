'use strict'

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

	async getCourses({ params, response }) {
		try {
			const { id } = params

			const courses = await User.find(id)

			return courses.courses().fetch()

			return response.json({
				status: 'success',
				data: courses
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Could not fetch courses.'
			})
		}
	}

	// add a course
	async addCourse({ request, response }) {
		const rules = {
			student_id: 'required|number',
			course_id: 'required|number'
		}

		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.json({ message: validation.messages() })
		}

		const data = request.only(['student_id', 'course_id'])

		try {
			// save to db
			const course = await StudentsCourse.create(data)

			return response.status(200).json({
				status: 'course added',
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Failed to add course'
			})
		}
	}

	// delete a course
	async destroy({ params, response, session }) {
		const { id } = params
		const course = await StudentsCourse.find(id)

		course.delete()


	}
}

module.exports = StudentController
