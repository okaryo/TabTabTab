import { WindowId } from '../../src/model/WindowId'

describe('#value', () => {
  it('should return window id value', () => {
    const actual = new WindowId(1).value
    const expected = 1
    expect(actual).toBe(expected)
  })
})

describe('#equalTo', () => {
  describe('when other value is same id', () => {
    it('should return true', () => {
      const actual = new WindowId(1).equalTo(new WindowId(1))
      expect(actual).toBeTruthy
    })
  })

  describe('when other value is not same id', () => {
    it('should return false', () => {
      const actual = new WindowId(1).equalTo(new WindowId(2))
      expect(actual).toBeFalsy
    })
  })
})

