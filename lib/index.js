'use strict'

const utils = require('microscopic-utils')
const Asserts = utils.asserts

const Messager = require('./messager')

const DEFAULT_OPTIONS = {
  worker: false,
  loadbalancing: true
}

/**
 * Abstract Transport class.
 *
 * @abstract
 */
class Transport {
  /**
   * @param {object} options
   * @param {Messager} messager
   */
  constructor (options = {}, messager = new Messager()) {
    Asserts.assert(this.constructor !== Transport, new TypeError('Abstract class "Transport" cannot be instantiated directly'))

    this.options = Object.assign({}, DEFAULT_OPTIONS, options)

    /**
     * @type {Messager}
     */
    this.messager = messager
  }

  /**
   * Creates message and adds to Messager.
   *
   * @param {object} msg
   * @param {function} callback
   * @return {Message}
   */
  createMessage (msg, callback) {
    return this.messager.createMessage(msg, callback)
  }

  /**
   * @param {object} response
   */
  onResponse (response) {
    const message = this.messager.getMessage(response.id)

    if (message) {
      message.callback(null, response.result)
    }
  }

  /**
   * Sends message from Client to Service.
   *
   * @abstract
   *
   * @param {object} connectionConfig
   * @param {object} msg
   * @param {function} callback
   */
  send (connectionConfig, msg, callback) {
    throw new Error('Must be implemented by subclass!')
  }

  /**
   * Starts listening.
   *
   * @abstract
   *
   * @param {Service} service
   *
   * @return {Promise.<Object>}
   */
  listen (service) {
    throw new Error('Must be implemented by subclass!')
  }
}

module.exports = Transport
