'use strict'

const utils = require('microscopic-utils')
const Random = utils.random

const _callback = Symbol('callback')
const _messager = Symbol('messager')
const _timeout = Symbol('timeout')

class Message {
  /**
   * @param {Messager} messager
   * @param {object} msg
   * @param {function} callback
   */
  constructor (messager, msg, callback) {
    this.id = Random.uuid()
    this.content = msg

    this[ _callback ] = callback
    this[ _messager ] = messager

    // GC - remove message after 3 minutes
    this[ _timeout ] = setTimeout(() => messager.deleteMessage(this.id), 180 * 1000)
  }

  /**
   * Callback method.
   *
   * @param {Error} error
   * @param {*} response
   */
  callback (error, response) {
    this[ _callback ](error, response)
    this[ _messager ].deleteMessage(this.id)
  }

  /**
   * Clears message timeout.
   */
  clearTimeout () {
    clearTimeout(this[ _timeout ])
  }

  toJSON () {
    return Object.assign({}, this)
  }

}

module.exports = Message
