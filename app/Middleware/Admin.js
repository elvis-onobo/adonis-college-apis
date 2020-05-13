'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
	async handle({ request, auth }, next) {
		const user = await auth.getUser()

		if (!user.role_id || user.role_id !== 1)
			throw new Error('You\'re not permitted to access this route') //InvalidAccessException()
		// call next to advance the request
		await next()
	}
}

module.exports = Admin
