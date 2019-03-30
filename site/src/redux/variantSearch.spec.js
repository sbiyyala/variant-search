/* globals describe, beforeEach, it, expect, spyOn */
import 'rxjs';
import {createEpicMiddleware} from "redux-observable";
import configureMockStore from "redux-mock-store";
import {requestSuggestions, variantSearchRootEpic} from "./variantSearch";
import * as services from "./services";
import {displayUnhandledError} from "./notifications";

describe('Given variant search root epic', () => {
    let mockStore, store, resolveRequest, rejectRequest;

    beforeEach(() => {
        spyOn(services, 'fetchVariantSuggestions');
        const middleware = createEpicMiddleware(variantSearchRootEpic);
        mockStore = configureMockStore([middleware]);
    });

    describe('Bleh', () => {
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