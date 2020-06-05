'use strict'

const { test, trait } = use('Test/Suite')('User')
const User = use('App/Models/User')
const Env = use('Env')

trait('Test/ApiClient')
trait('Auth/Client')

test('a guest can signup', async ({ client }) => {
	const user = {
		firstname: 'Adonis 101',
		lastname: 'Blog post content',
		email: 'adonis@trans.com',
		street: '123 road street',
		role_id: 1,
		state_id: 2,
		password: 'password'
	}

	const user2 = {
		firstname: 'Adonis',
		lastname: 'Blog',
		email: 'adonisabc@trans.com',
		street: '123 road street',
		role_id: 2,
		state_id: 2,
		password: 'password'
	}

	const response1 = await client.post('/signup')
		.header('accept', 'application/json')
		.send(user)
		.end()

	const response2 = await client.post('/signup')
		.header('accept', 'application/json')
		.send(user2)
		.end()

	response1.assertStatus(200)
	response2.assertStatus(200)
}).timeout(0)

test('a user can login', async ({ client }) => {
	const user = {
		email: 'adonis@trans.com',
		password: 'password'
	}

	const response = await client.post('/login')
		.send(user)
		.end()

	// set the user data in Env
	Env.set('USER_TOKEN', response.body.data.token)

	response.assertStatus(200)
}).timeout(0)

test('a user can view profile', async ({ client }) => {
	const response = await client.get('/profile/' + 1)
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.end()

	response.assertStatus(200)
}).timeout(0)

test('admin can update user role', async ({ client }) => {
	const response = await client.put('/admin/update-user/' + 2)
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.send({ role: 3 })
		.end()

	response.assertStatus(200)
})

test('admin can create a department', async ({ client }) => {
	const data = {
		colleges_id: 1,
		dep_label: 'Sociology'
	}

	const response = await client.post('/admin/department')
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.send(data)
		.end()

	response.assertStatus(200)
})

test('admin can add user as instructor in a department', async ({ client }) => {
	const data = {
		user_id: 1,
		department_id: 1
	}

	const response = await client.post('/admin/instructor')
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.send(data)
		.end()

	response.assertStatus(200)
})


test('admin can add user as instructor in a department', async ({ client }) => {
	const data = {
		user_id: 1,
		department_id: 1
	}

	const response = await client.post('/admin/instructor')
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.send(data)
		.end()

	response.assertStatus(200)
})

test('admin can create a course', async ({ client }) => {
	const data = {
		department_id: 1,
		course_title: 'Medical Sociology'
	}

	const response = await client.post('/admin/course')
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.send(data)
		.end()

	response.assertStatus(200)
})

test('admin can get all users', async ({ client }) => {
	const response = await client.get('/admin/users')
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.end()

	response.assertStatus(200)
})

test('admin can get one user', async ({ client }) => {
	const response = await client.get('/admin/users/' + 2)
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.end()

	console.log(response.error)

	response.assertStatus(200)
})

test('admin can delete a user', async ({ client }) => {
	const response = await client.delete('/admin/users/' + 2)
		.header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.end()

	console.log(response.error)

	response.assertStatus(200)
})