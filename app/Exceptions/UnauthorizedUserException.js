'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const message = 'You are not authorized to access this route'
const status = 401
const code = 'Unauthorized'

class UnauthorizedUserException extends LogicalException {
	constructor() {
		super(message, status, code)
	}

	/**
   * Handle this exception by itself
   */
	// handle () {}
}

module.exports = UnauthorizedUserException
