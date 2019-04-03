/* globals describe, beforeEach, it, expect */

import {displayUnhandledError, notifications} from "./notifications";

describe('Given notifications reducer', () => {
    let actual, given;

    const initialState = {
        unhandled: {
            error: null
        }
    };

    describe('When state is initialized', () => {
        beforeEach(() => {
            given = actual;
            actual = notifications(undefined, {type: 'test-type'});
        });

        it('Then returns initial state', () => {
            expect(actual).toEqual(initialState);
        });

        describe('When displayUnhandledError action is emitted', () => {
            beforeEach(() => {
                given = actual;
                actual = notifications(given, displayUnhandledError('unhandled-error'));
            });

            it('Then error is set in state', () => {
                expect(actual).toEqual({
                    ...given,
                    unhandled: {
                        error: 'unhandled-error'
                    }
                });
            });
        });
    });
});