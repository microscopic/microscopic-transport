'use strcit'

const chai = require('chai')
const sinon = require('sinon')

const expect = chai.expect

const Message = require('../lib/message')

describe('Message', () => {
  describe('constructor()', () => {
    it('should set random id', () => {
      const message = new Message({}, { a: 1, b: 2 }, () => 1)
      const message1 = new Message({}, { a: 1, b: 2 }, () => 1)

      expect(message.id).to.be.a('string')
      expect(message.id).to.not.be.equal(message1.id)
    })

    it('should set content', () => {
      const message = new Message({}, { a: 1, b: 2 }, () => 1)

      expect(message.content).to.be.deep.equal({ a: 1, b: 2 })
    })

    it('timeout should delete message from `Messager`', () => {
      const clock = sinon.useFakeTimers()

      const messagerMock = { deleteMessage: sinon.spy() }
      const callbackSpy = sinon.spy()

      const message = new Message(messagerMock, { a: 1, b: 2 }, callbackSpy)

      clock.tick(180 * 1000)

      expect(messagerMock.deleteMessage.calledWith(message.id)).to.be.true
      expect(callbackSpy.called).to.be.false

      clock.restore()
    })
  })

  describe('callback()', () => {
    it('should call callback on message', () => {
      const callbackSpy = sinon.spy()
      const message = new Message({ deleteMessage: () => 1 }, { a: 1 }, callbackSpy)

      const error = { error: 1 }
      const result = { result: 1 }

      message.callback(error, result)

      expect(callbackSpy.calledWith(error, result)).to.be.true
    })

    it('should delete message from `Messager`', () => {
      const deleteMessageSpy = sinon.spy()
      const message = new Message({ deleteMessage: deleteMessageSpy }, { a: 1 }, () => 1)

      const error = { error: 1 }
      const result = { result: 1 }

      message.callback(error, result)

      expect(deleteMessageSpy.calledWith(message.id)).to.be.true
    })
  })

  describe('clearTimeout', () => {
    it('should clear timeout', () => {
      const clock = sinon.useFakeTimers()

      const messagerMock = { deleteMessage: sinon.spy() }
      const callbackSpy = sinon.spy()

      const message = new Message(messagerMock, { a: 1, b: 2 }, callbackSpy)

      message.clearTimeout()

      clock.tick(180 * 1000)

      expect(messagerMock.deleteMessage.called).to.be.false
      expect(callbackSpy.called).to.be.false

      clock.restore()
    })
  })

  describe('toJSON', () => {
    it('should create copy of `Message`', () => {
      const message = new Message({}, { a: 1, b: 2 }, () => 1)

      expect(message.toJSON()).to.not.equal(message)
    })

    it('should return copy without callback and timeout field', () => {
      const message = new Message({}, { a: 1, b: 2 }, () => 1)

      const json = message.toJSON()

      expect(json.callback).to.be.undefined
      expect(json.timeout).to.be.undefined
    })

    it('should return copy without callback and timeout field', () => {
      const message = new Message({}, { a: 1, b: 2 }, () => 1)

      const json = message.toJSON()

      expect(json.callback).to.be.undefined
      expect(json.timeout).to.be.undefined
    })

    it('should return copy without callback and timeout field -     JSON.stringify', () => {
      const message = new Message({}, { a: 1, b: 2 }, () => 1)

      const json = JSON.stringify(message)

      expect(json.callback).to.be.undefined
      expect(json.timeout).to.be.undefined
    })
  })
})
