/* globals describe, beforeEach, it, expect */

import {chunkString} from "./utils";

describe('Given utils', () => {
    describe('Given chunkString utility', () => {
        const scenarios = [
            {
                when: 'input is an array',
                then: 'input is returned as-is',
                input: ['abc', 'def'],
                expected: ['abc', 'def']
            },
            {
                when: 'input is a string and limit is 2',
                then: 'input is chunked appropriately',
                input: 'abcdef',
                limit: 3,
                expected: ['abc', 'def']
            }
        ];

        scenarios.forEach(({when, then, input, limit, expected}) => {
            describe(`When ${when}`, () => {
                let actual;
                beforeEach(() => {
                    actual = chunkString(input, limit);
                });

                it(`Then ${then}`, () => {
                    expect(actual).toEqual(expected);
                });
            });
        });
    });
});