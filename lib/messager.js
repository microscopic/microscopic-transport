'use strict'

const Message = require('./message')

const _messages = Symbol('messages')

class Messager {
  constructor () {
    /**
     * Messages storage.
     *
     * @type {Map}
     */
    this[ _messages ] = new Map()
  }

  /**
   * Creates message.
   *
   * @param {*} msg
   * @param {function} callback
   * @return {Message}
   */
  createMessage (msg, callback) {
    const message = _createMessage(this, msg, callback)

    this._addMessage(message)

    return message
  }

  /**
   * Deletes message by id.
   *
   * @param {string} id
   */
  deleteMessage (id) {
    const message = this.getMessage(id)

    if (!message) {
      return
    }

    message.clearTimeout()

    this[ _messages ].delete(id)
  }

  /**
   * Returns message by id.
   *
   * @param {string} id
   * @return {Message}
   */
  getMessage (id) {
    return this[ _messages ].get(id)
  }

  /**
   * Adds message to storage.
   *
   * @param {Message} message
   * @protected
   */
  _addMessage (message) {
    this[ _messages ].set(message.id, message)
  }
}

/**
 * Creates instance of Message.
 *
 * @param {Messager} messager
 * @param {object} msg
 * @param {function} callback
 * @return {Message}
 * @private
 */
function _createMessage (messager, msg, callback) {
  return new Message(messager, msg, callback)
}

module.exports = Messager
