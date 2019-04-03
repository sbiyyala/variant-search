/* globals describe, beforeEach, it, expect, spyOn */
import 'rxjs';
import {createEpicMiddleware} from "redux-observable";
import configureMockStore from "redux-mock-store";
import {
    receiveSuggestions,
    requestSuggestions,
    setVariantSearchTerm,
    variantSearch,
    variantSearchRootEpic
} from "./variantSearch";
import * as services from "./services";
import {displayUnhandledError} from "./notifications";

describe('Given variant search reducer', () => {
    let actual, given;

    const initialState = {
        isLoading: false,
        searchResults: [],
        searchText: "",
        selectedGene: "",
        suggestions: []
    };

    describe('When state is initialized', () => {
        beforeEach(() => {
            given = actual;
            actual = variantSearch(undefined, {type: 'test-type'});
        });

        it('Then returns initial state', () => {
            expect(actual).toEqual(initialState);
        });

        describe('When setVariantSearchTerm action is emitted', () => {
            beforeEach(() => {
                given = actual;
                actual = variantSearch(given, setVariantSearchTerm('search'));
            });

            it('Then sets search term in state', () => {
                expect(actual).toEqual({
                    ...given,
                    searchText: 'search'
                });
            });

            describe('When requestSuggestions action is emitted', () => {
                beforeEach(() => {
                    given = actual;
                    actual = variantSearch(given, requestSuggestions());
                });

                it('Then isLoading is set to true and searchResults are reset', () => {
                    expect(actual).toEqual({
                        ...given,
                        isLoading: true,
                        searchResults: []
                    });
                });
            });
        });
    });
});

describe('Given variant search root epic', () => {
    let mockStore, store, resolveRequest, rejectRequest;

    beforeEach(() => {
        spyOn(services, 'fetchVariantSuggestions');
        const middleware = createEpicMiddleware(variantSearchRootEpic);
        mockStore = configureMockStore([middleware]);
    });

    describe('When variant suggestions are requested', () => {
        beforeEach(() => {
            store = mockStore({
                variantSearch: {
                    searchText: 'AA',
                    isLoading: false,
                    suggestions: [],
                    searchResults: [],
                    selectedGene: ''
                }
            });

            services.fetchVariantSuggestions.and.returnValue(new Promise((resolve, reject) => {
                resolveRequest = resolve;
                rejectRequest = reject;
            }));

            store.dispatch(requestSuggestions());
        });

        it('Then calls the suggestions service', () => {
            expect(services.fetchVariantSuggestions).toHaveBeenCalledWith('AA');
        });

        describe(('When request succeeds'), () => {
            beforeEach(() => {
                resolveRequest([{'gene': 'AA'}, {'gene': 'AB'}]);
            });

            it('Then receive suggestions action is emitted', () => {
                expect(store.getActions()).toEqual([
                    requestSuggestions(),
                    receiveSuggestions([{'gene': 'AA'}, {'gene': 'AB'}])
                ]);
            });
        });

        describe(('When request fails'), () => {
            beforeEach(() => {
                rejectRequest('test-error');
            });

            it('Then displaysUnhandledError', () => {
                expect(store.getActions()).toEqual([
                    requestSuggestions(),
                    displayUnhandledError('test-error')
                ]);
            });
        });
    });
});