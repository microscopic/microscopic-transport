'use strict'

const chai = require('chai')

const expect = chai.expect

const Message = require('../lib/message')
const Messager = require('../lib/messager')

describe('Messager', () => {
  describe('createMessage()', () => {
    it('should return `Message`', () => {
      const messager = new Messager()

      const message = messager.createMessage({ a: 1, b: 2 }, () => 1)
      expect(message).to.be.instanceOf(Message)
    })

    it('should storage message into `Messager`', () => {
      const messager = new Messager()

      const message = messager.createMessage({ a: 1, b: 2 }, () => 1)
      const message1 = messager.getMessage(message.id)

      expect(message1.id).to.be.equal(message.id)
    })
  })

  describe('deleteMessage()', () => {
    it('should delete message', () => {
      const messager = new Messager()

      const message = messager.createMessage({ a: 1, b: 2 }, () => 1)

      expect(messager.getMessage(message.id)).to.be.instanceOf(Message)

      messager.deleteMessage(message.id)

      expect(messager.getMessage(message.id)).to.be.undefined
    })

    it('should do nothing if message does not exist', () => {
      const messager = new Messager()

      messager.deleteMessage(123)
    })
  })
})
