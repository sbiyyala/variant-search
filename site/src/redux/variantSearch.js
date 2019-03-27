import {ajax} from "../ajax";
import {combineEpics} from "redux-observable";

const INIT_STATE = {
    searchText: '',
    isLoading: false,
    suggestions: [],
    searchResults: [],
    selectedGene: ''
};

const SET_VARIANT_SEARCH_TERM = 'SET_VARIANT_SEARCH_TERM';
const REQUEST_VARIANT_SUGGESTIONS = 'REQUEST_VARIANT_SUGGESTIONS';
const RECEIVE_VARIANT_SUGGESTIONS = 'RECEIVE_VARIANT_SUGGESTIONS';
const REQUEST_SEARCH_RESULTS = 'REQUEST_SEARCH_RESULTS';
const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS';

const setVariantSearchTerm = (searchText) => ({type: SET_VARIANT_SEARCH_TERM, searchText});
const requestSuggestions = () => ({type: REQUEST_VARIANT_SUGGESTIONS});
const receiveSuggestions = suggestions => ({type: RECEIVE_VARIANT_SUGGESTIONS, suggestions});

const requestSearchResults = selectedGene => ({type: REQUEST_SEARCH_RESULTS, selectedGene});
const receiveSearchResults = searchResults => ({type: RECEIVE_SEARCH_RESULTS, searchResults});

const variantSearch = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_VARIANT_SEARCH_TERM: {
            const {searchText} = action;
            return {
                ...state,
                searchText,
                isLoading: false
            }
        }
        case REQUEST_VARIANT_SUGGESTIONS: {
            return {
                ...state,
                isLoading: true
            }
        }

        case RECEIVE_VARIANT_SUGGESTIONS: {
            const {suggestions} = action;
            return {
                ...state,
                isLoading: false,
                suggestions
            }
        }

        case REQUEST_SEARCH_RESULTS:
            const {selectedGene} = action;
            return {
                ...state,
                selectedGene
            };

        case RECEIVE_SEARCH_RESULTS:
            const {searchResults} = action;
            return {
                ...state,
                searchResults
            };

        default:
            return state;
    }
};

const requestVariantSuggestionsEpic = (action$, store) =>
    action$.ofType(REQUEST_VARIANT_SUGGESTIONS)
        .map(() => {
            const {variantSearch: {searchText: term}} = store.getState();
            return ajax(`/api/variant/suggest?q=${term}`)
                .then(response => response.json())
                .then(receiveSuggestions);
        })
        .flatMap(actions => actions);

const requestVariantSearchResultsEpic = (action$, store) =>
    action$.ofType(REQUEST_SEARCH_RESULTS)
        .map(() => {
            const {variantSearch: {selectedGene}} = store.getState();
            return ajax(`/api/variant/search?q=${selectedGene}`)
                .then(response => response.json())
                .then(receiveSearchResults);
        })
        .flatMap(actions => actions);

const rootEpic = combineEpics(requestVariantSuggestionsEpic, requestVariantSearchResultsEpic);

export {
    variantSearch,
    rootEpic,
    setVariantSearchTerm,
    requestSuggestions,
    receiveSuggestions,
    requestSearchResults,
    receiveSearchResults
};