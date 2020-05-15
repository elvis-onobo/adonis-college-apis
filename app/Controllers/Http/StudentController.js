'use strict'

const StudentsCourse = use('App/Models/StudentsCourse')
const Department = use('App/Models/Department')
const Course = use('App/Models/Course')
const User = use('App/Models/User')

class StudentController {
	// add a course
	async addCourse({ request, response }) {
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

	// get all courses for a user
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

	// delete a course
	async destroy({ params, response }) {
		try {
			const { id } = params
			const course = await StudentsCourse.find(id)

			course.delete()

			return response.json({
				status: 'success',
			})
		} catch (error) {
			return response.status(400).json({
				status: 'error',
				message: 'Unable to delete course'
			})
		}
	}
}

module.exports = StudentController
