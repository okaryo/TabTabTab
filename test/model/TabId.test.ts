import { TabId } from '../../src/model/TabId'

describe('#value', () => {
  it('should return tab id value', () => {
    const actual = new TabId(1).value
    const expected = 1
    expect(actual).toBe(expected)
  })
})

describe('#equalTo', () => {
  describe('when other value is same id', () => {
    it('should return true', () => {
      const actual = new TabId(1).equalTo(new TabId(1))
      expect(actual).toBeTruthy
    })
  })

  describe('when other value is not same id', () => {
    it('should return false', () => {
      const actual = new TabId(1).equalTo(new TabId(2))
      expect(actual).toBeFalsy
    })
  })
})

