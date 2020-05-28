'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const UserRole = use('App/Models/Role')

class Role {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
	async handle({ view, auth }, next) {
		const user = await auth.getUser()

		view.share({
			role: await UserRole.find(user.role_id)
		})

		// call next to advance the request
		await next()
	}
}

module.exports = Role
