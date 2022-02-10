import { Tab } from '../../src/model/Tab'
import { TabId } from '../../src/model/TabId'

describe('#id', () => {
  it('should return tab id', () => {
    const actual = new Tab(new TabId(1), 'title', new URL('https://example.com/path'), 'https://favicon.com', true).id
    const expected = new TabId(1)
    expect(actual).toStrictEqual(expected)
  })
})

describe('#title', () => {
  it('should return tab title', () => {
    const actual = new Tab(new TabId(1), 'title', new URL('https://example.com/path'), 'https://favicon.com', true).title
    const expected = 'title'
    expect(actual).toBe(expected)
  })
})

describe('#originUrl', () => {
  it('should return tab url', () => {
    const actual = new Tab(new TabId(1), 'title', new URL('https://example.com/path'), 'https://favicon.com', true).originUrl
    const expected = 'https://example.com'
    expect(actual).toBe(expected)
  })
})

describe('#favIconUrl', () => {
  it('should return tab favIconUrl', () => {
    const actual = new Tab(new TabId(1), 'title', new URL('https://example.com/path'), 'https://favicon.com', true).favIconUrl
    const expected = 'https://favicon.com'
    expect(actual).toBe(expected)
  })
})

describe('#isFocused', () => {
  describe('when tab is focused', () => {
    it('should return true', () => {
      const actual = new Tab(new TabId(1), 'title', new URL('https://example.com/path'), 'https://favicon.com', true).isFocused
      expect(actual).toBeTruthy
    })
  })

  describe('when tab is not focused', () => {
    it('should return false', () => {
      const actual = new Tab(new TabId(1), 'title', new URL('https://example.com/path'), 'https://favicon.com', false).isFocused
      expect(actual).toBeFalsy
    })
  })
})
