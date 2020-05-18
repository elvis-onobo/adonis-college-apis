'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// views
Route.get('/', ({ view }) => {
	return view.render('signup')
})
Route.on('/login').render('login')

// middlewares: admin, student, instructor, hod
// student(2), instructor(3) or HOD(4)
Route.post('/signup', 'UserController.signup')
Route.post('/login', 'UserController.login')
Route.get('/profile/:id', 'UserController.profile').middleware(['auth:jwt'])

Route.group(() => {
	Route.put('/update-user/:id', 'UserController.updateUser')
	Route.post('/department', 'UserController.department')
	Route.post('/instructor', 'UserController.instructor')
	Route.post('/course', 'UserController.course')
	Route.get('/users', 'UserController.getAllUsers')
	Route.get('/users/:id', 'UserController.getOneUser')
	Route.delete('/users/:id', 'UserController.deleteUser')
}).prefix('admin').middleware(['auth:jwt', 'admin'])

Route.group(() => {
	Route.post('/course', 'StudentController.addCourse')
	Route.get('/courses/:id', 'StudentController.getCourses')
	Route.delete('/course/:id', 'StudentController.destroy')
}).prefix('student').middleware(['auth:jwt', 'student'])

Route.group(() => {
	Route.put('/course/:id', 'HodController.courseIntructor')
	Route.delete('/instructor/:id', 'HodController.destroyInstructor')
}).prefix('hod').middleware(['auth:jwt', 'hod'])

Route.group(() => {
	Route.get('/course/:id', 'InstructorController.courses')
}).prefix('instructor').middleware(['auth:jwt', 'instructor'])