const { sortPages } = require('./report.js')
const { text, expect } = require('@jest/globals')

test(`sortPages 2 pages`, () => {
    const input = {
        'https://wagslane.dev': 1,
        'https://wikipedia.com': 3
    }
    const actual = sortPages(input)
    const expected = [
        ['https://wikipedia.com', 3],
        ['https://wagslane.dev', 1]
    ]
    expect(actual).toEqual(expected)
})


test(`sortPages 5 pages`, () => {
    const input = {
        'https://wagslane.dev': 1,
        'https://wikipedia.com': 3,
        'https://wagslane.dev/path1': 7, 
        'https://wagslane.dev/path2': 2,
        'https://wagslane.dev/path4': 9
    }
    const actual = sortPages(input)
    const expected = [
        ['https://wagslane.dev/path4', 9],
        ['https://wagslane.dev/path1', 7],
        ['https://wikipedia.com', 3],
        ['https://wagslane.dev/path2', 2],
        ['https://wagslane.dev', 1]
    ]
    expect(actual).toEqual(expected)
})