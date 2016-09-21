'use strcit'

const chai = require('chai')
const sinon = require('sinon')

const expect = chai.expect

const Messager = require('../lib/messager')
const Transport = require('../lib/index')

describe('Transport', () => {
  class TestTransport extends Transport {

  }

  describe('constructor()', () => {
    it('should throw error when creating an object - abstract class', () => {
      expect(() => new Transport()).to.throw(TypeError)
    })

    it('should assign options', () => {
      const transport = new TestTransport({ a: 1, b: 2 })

      expect(transport.options.a).to.be.equal(1)
      expect(transport.options.b).to.be.equal(2)
      expect(transport.options.worker).to.be.equal(false)
    })

    it('should set Messager', () => {
      const transport = new TestTransport()

      expect(transport.messager).to.be.instanceOf(Messager)
    })
  })

  describe('createMessage()', () => {
    it('should call `createMessage` on `Messager`', () => {
      const messagerMock = {
        createMessage: sinon.spy()
      }

      const transport = new TestTransport({}, messagerMock)

      const msg = { a: 1, b: 2, c: 3 }
      const callback = () => 1

      transport.createMessage(msg, callback)

      expect(messagerMock.createMessage.calledWith(msg, callback)).to.be.true
    })
  })

  describe('onResponse()', () => {
    it('should call callback on message', () => {
      const messageCallbackSpy = sinon.spy()

      const messagerMock = {
        getMessage: () => ({ callback: messageCallbackSpy })
      }

      const transport = new TestTransport({}, messagerMock)

      const response = { id: 123, result: { a: 1, b: 2, c: 3 } }
      transport.onResponse(response)

      expect(messageCallbackSpy.calledWith(null, response.result)).to.be.true
    })

    it('should do nothing if message does not exist', () => {
      const messageCallbackSpy = sinon.spy()

      const messagerMock = {
        getMessage: () => null
      }

      const transport = new TestTransport({}, messagerMock)

      const response = { id: 123, result: { a: 1, b: 2, c: 3 } }
      transport.onResponse(response)

      expect(messageCallbackSpy.calledWith(null, response.result)).to.be.false
    })
  })

  describe('send()', () => {
    it('should throw not implemented error', () => {
      const transport = new TestTransport()

      expect(() => transport.send()).to.throw('Must be implemented by subclass!')
    })
  })

  describe('listen()', () => {
    it('should throw not implemented error', () => {
      const transport = new TestTransport()

      expect(() => transport.listen()).to.throw('Must be implemented by subclass!')
    })
  })
})
