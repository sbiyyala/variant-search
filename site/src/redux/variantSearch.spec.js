/* globals describe, beforeEach, it, expect, spyOn */
import 'rxjs';
import {createEpicMiddleware} from "redux-observable";
import configureMockStore from "redux-mock-store";
import {
    receiveSearchResults,
    receiveSuggestions,
    requestSearchResults,
    requestSuggestions,
    setVariantSearchTerm,
    toggleShowMappings,
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

                describe('When receiveSuggestions action is emitted', () => {
                    beforeEach(() => {
                        given = actual;
                        actual = variantSearch(given, receiveSuggestions([
                            {gene: 'AA'},
                            {gene: 'AB'},
                            {gene: 'AC'}
                        ]));
                    });

                    it('Then suggestions are set in state, and isLoading is set to false', () => {
                        expect(actual).toEqual(({
                            ...given,
                            isLoading: false,
                            suggestions: [{"gene": "AA"}, {"gene": "AB"}, {"gene": "AC"}]
                        }));
                    });

                    describe('When a gene is selected from suggestions, requesting search results', () => {
                        beforeEach(() => {
                            given = actual;
                            actual = variantSearch(given, requestSearchResults("AA"));
                        });

                        it('Then selected gene is set in state', () => {
                            expect(actual).toEqual({
                                ...given,
                                selectedGene: 'AA'
                            });
                        });

                        describe('When search results are received', () => {
                            const searchResults = [
                                {gene: 'AA', nucleotideChange: 'change-1'},
                                {gene: 'AA', nucleotideChange: 'change-2'},
                                {gene: 'AA', nucleotideChange: 'change-3'}
                            ];

                            beforeEach(() => {
                                given = actual;
                                actual = variantSearch(given, receiveSearchResults(searchResults));
                            });

                            it('Then stores search results in state, defaulting showMappings attribute to false', () => {
                                expect(actual).toEqual({
                                    ...given,
                                    searchResults: searchResults.map(result => ({...result, showMappings: false}))
                                })
                            });

                            describe('When a gene variant nucleotideChange is toggle to show otherMappings', () => {
                                beforeEach(() => {
                                    given = actual;
                                    actual = variantSearch(given, toggleShowMappings('change-2'))
                                });

                                it('Then corresponding gene variant showMappings flag is toggled', () => {
                                    expect(actual).toEqual({
                                        ...given,
                                        searchResults: [
                                            {
                                                "gene": "AA",
                                                "nucleotideChange": "change-1",
                                                "showMappings": false
                                            },
                                            {
                                                "gene": "AA",
                                                "nucleotideChange": "change-2",
                                                "showMappings": true
                                            },
                                            {
                                                "gene": "AA",
                                                "nucleotideChange": "change-3",
                                                "showMappings": false
                                            }
                                        ],
                                    });
                                });
                            });
                        });
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
        spyOn(services, 'fetchVariantSearchResults');
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

    describe('When search results are requested', () => {
        beforeEach(() => {
            store = mockStore({
                variantSearch: {
                    searchText: 'AA',
                    isLoading: false,
                    suggestions: [],
                    searchResults: [],
                    selectedGene: 'AABC'
                }
            });

            services.fetchVariantSearchResults.and.returnValue(new Promise((resolve, reject) => {
                resolveRequest = resolve;
                rejectRequest = reject;
            }));

            store.dispatch(requestSearchResults('AABC'));
        });

        it('Then calls the search service', () => {
            expect(services.fetchVariantSearchResults).toHaveBeenCalledWith('AABC');
        });

        describe(('When request succeeds'), () => {
            const receivedSearchResults = [
                {'gene': 'AABC', 'nucleotideChange': 'change-1'},
                {'gene': 'AABC', 'nucleotideChange': 'change-2'}
            ];
            beforeEach(() => {
                resolveRequest(receivedSearchResults);
            });

            it('Then receive suggestions action is emitted', () => {
                expect(store.getActions()).toEqual([
                    requestSearchResults('AABC'),
                    receiveSearchResults(receivedSearchResults)
                ]);
            });
        });

        describe(('When request fails'), () => {
            beforeEach(() => {
                rejectRequest('test-error');
            });

            it('Then displaysUnhandledError', () => {
                expect(store.getActions()).toEqual([
                    requestSearchResults('AABC'),
                    displayUnhandledError('test-error')
                ]);
            });
        });
    });
});