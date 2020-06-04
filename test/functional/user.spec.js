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

	const response = await client.post('/signup')
		.header('accept', 'application/json')
		.send(user)
		.end()

	response.assertStatus(200)
}).timeout(0)

test('a user can login', async ({ client }) => {
	const user = {
		email: 'adonis@trans.com',
		password: 'password'
	}

	const response = await client.post('/login')
		// .header('Authorization', `Bearer ${Env.get('USER_TOKEN')}`)
		.send(user)
		.end()

	// set the user data in Env
	Env.set('USER_TOKEN', response.body.data.token)

	response.assertStatus(200)
}).timeout(0)

