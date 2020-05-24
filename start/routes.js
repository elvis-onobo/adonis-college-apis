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
// admin(1), student(2), instructor(3) or HOD(4)
Route.get('/', 'UserController.showSignupForm')
Route.post('/signup', 'UserController.signup').as('signup')
Route.get('/login', 'UserController.showLoginPage')
Route.post('/login', 'UserController.login').as('login')
Route.get('/home', 'UserController.showHomePage').as('home').middleware(['auth'])
Route.get('/profile/:id', 'UserController.profile').as('profile').middleware(['auth'])

Route.group(() => {
	Route.get('/users', 'UserController.getAllUsers').as('users')
	Route.get('/users/:id', 'UserController.getOneUser').as('single-user')
	Route.get('/roles', 'UserController.showCreateRolesForm').as('create-role-form')
	Route.post('/roles', 'UserController.createRole').as('create-role')
	Route.get('/users/update/:id', 'UserController.showUpdateRoleForm').as('update-role-form')
	Route.post('/update-user/:id', 'UserController.updateUser').as('update-role')
	Route.get('/college', 'UserController.showCreateCollegeForm').as('create-college-form')
	Route.post('/college', 'UserController.createCollege').as('create-college')
	Route.post('/department', 'UserController.department')
	Route.get('/instructor/:id', 'UserController.showAddUserAsIntructorForm').as('add-user-as-instructor-form')
	Route.post('/instructors/:id', 'UserController.instructor').as('add-instructor-to-dep')
	Route.post('/course', 'UserController.course')
	Route.get('/users/delete/:id', 'UserController.deleteUser').as('delete-user')
}).prefix('admin').middleware(['auth', 'admin'])

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

// Logout User
Route.get('/logout', 'UserController.logoutUser').as('logoutUser')
