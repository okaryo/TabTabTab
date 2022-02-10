import { Tab } from '../../src/model/Tab'
import { TabId } from '../../src/model/TabId'
import { Tabs } from '../../src/model/Tabs'
import { TbWindow } from '../../src/model/Window'
import { WindowId } from '../../src/model/WindowId'

describe('#initializeBy', () => {
  it('should generate empty window', () => {
    const actual = TbWindow.initializeBy(new WindowId(1), false)
    const expected = new TbWindow(new WindowId(1), new Tabs([]), false)
    expect(actual).toStrictEqual(expected)
  })
})

describe('#id', () => {
  it('should return it', () => {
    const actual = new TbWindow(new WindowId(1), new Tabs([]), false).id
    const expected = new WindowId(1)
    expect(actual).toStrictEqual(expected)
  })
})

describe('#tabs', () => {
  it('should return tabs', () => {
    const actual = new TbWindow(
      new WindowId(1),
      new Tabs([
        new Tab(new TabId(1), 'title1', new URL('https://example.com/path'), 'https://favicon.com', false),
        new Tab(new TabId(2), 'title2', new URL('https://example.com/path'), 'https://favicon.com', false)
      ]),
      false
    ).tabs
    const expected = new Tabs([
        new Tab(new TabId(1), 'title1', new URL('https://example.com/path'), 'https://favicon.com', false),
        new Tab(new TabId(2), 'title2', new URL('https://example.com/path'), 'https://favicon.com', false)
    ])
    expect(actual).toStrictEqual(expected)
  })
})

describe('#isFocused', () => {
  describe('when window is focused', () => {
    it('should return true', () => {
      const actual = new TbWindow(new WindowId(1), new Tabs([]), true).isFocused
      expect(actual).toBeTruthy
    })
  })

  describe('when window is not focused', () => {
    it('should return false', () => {
      const actual = new TbWindow(new WindowId(1), new Tabs([]), false).isFocused
      expect(actual).toBeFalsy
    })
  })
})

describe('#tabCount', () => {
  it('should return tab count', () => {
    const actual = new TbWindow(
      new WindowId(1),
      new Tabs([
        new Tab(new TabId(1), 'title1', new URL('https://example.com/path'), 'https://favicon.com', false),
        new Tab(new TabId(2), 'title2', new URL('https://example.com/path'), 'https://favicon.com', false)
      ]),
      false
    ).tabCount
    const expected = 2
    expect(actual).toBe(expected)
  })
})
