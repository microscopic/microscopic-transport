'use strict'

const utils = require('microscopic-utils')
const Random = utils.random

const _callback = Symbol('callback')
const _messager = Symbol('messager')

class Message {
  /**
   * @param {Messager} messager
   * @param {object} msg
   * @param {function} callback
   */
  constructor (messager, msg, callback) {
    Object.assign(this, msg)

    this.id = Random.uuid()

    this.timeout = setTimeout(() => messager.deleteMessage(this.id), 5000)

    this[ _callback ] = callback
    this[ _messager ] = messager
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
    clearTimeout(this.timeout)
  }

  toJSON () {
    const messageCopy = Object.assign({}, this)

    delete messageCopy.callback
    delete messageCopy.timeout

    return messageCopy
  }

}

module.exports = Message
