import { GroupId } from "./../../src/model/GroupId"

describe('#value', () => {
  it('should return id value', () => {
    const actual = new GroupId(1).value
    const expected = 1
    expect(actual).toBe(expected)
  })
})

describe('#equalTo', () => {
  describe('when other id is same', () => {
    it('should return true', () => {
      const actual = new GroupId(1).equalTo(new GroupId(1))
      expect(actual).toBeTruthy
    })
  })

  describe('when other id is not same', () => {
    it('should return false', () => {
      const actual = new GroupId(1).equalTo(new GroupId(2))
      expect(actual).toBeFalsy
    })
  })
})
