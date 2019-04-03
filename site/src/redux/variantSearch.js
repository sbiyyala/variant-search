import {combineEpics} from "redux-observable";
import {fetchVariantSearchResults, fetchVariantSuggestions} from "./services";
import {displayUnhandledError} from "./notifications";

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
const TOGGLE_SHOW_MAPPINGS = 'TOGGLE_SHOW_MAPPINGS';

const setVariantSearchTerm = (searchText) => ({type: SET_VARIANT_SEARCH_TERM, searchText});
const requestSuggestions = () => ({type: REQUEST_VARIANT_SUGGESTIONS});
const receiveSuggestions = suggestions => ({type: RECEIVE_VARIANT_SUGGESTIONS, suggestions});

const requestSearchResults = selectedGene => ({type: REQUEST_SEARCH_RESULTS, selectedGene});
const receiveSearchResults = searchResults => ({type: RECEIVE_SEARCH_RESULTS, searchResults});
const toggleShowMappings = (nucleotideChange) => ({type: TOGGLE_SHOW_MAPPINGS, nucleotideChange});

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
                isLoading: true,
                searchResults: []
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

        case REQUEST_SEARCH_RESULTS: {
            const {selectedGene} = action;
            return {
                ...state,
                selectedGene
            };
        }

        case RECEIVE_SEARCH_RESULTS: {
            const {searchResults} = action;
            return {
                ...state,
                searchResults: searchResults.map(result => ({...result, showMappings: false}))
            };
        }

        case TOGGLE_SHOW_MAPPINGS: {
            const {nucleotideChange} = action;
            const {searchResults} = state;
            const updated = searchResults.map(result => {
                if (result.nucleotideChange === nucleotideChange) {
                    return {...result, showMappings: !result.showMappings};
                } else {
                    return result;
                }
            });
            return {...state, searchResults: updated};
        }

        default:
            return state;
    }
};

const requestVariantSuggestionsEpic = (action$, store) =>
    action$.ofType(REQUEST_VARIANT_SUGGESTIONS)
        .map(() => {
            const {variantSearch: {searchText: term}} = store.getState();
            return fetchVariantSuggestions(term)
                .then(receiveSuggestions)
                .catch(displayUnhandledError);
        })
        .flatMap(actions => actions);

const requestVariantSearchResultsEpic = (action$, store) =>
    action$.ofType(REQUEST_SEARCH_RESULTS)
        .map(() => {
            const {variantSearch: {selectedGene}} = store.getState();
            return fetchVariantSearchResults(selectedGene)
                .then(receiveSearchResults)
                .catch(displayUnhandledError);
        })
        .flatMap(actions => actions);

const variantSearchRootEpic = combineEpics(requestVariantSuggestionsEpic, requestVariantSearchResultsEpic);

export {
    variantSearch,
    variantSearchRootEpic,
    setVariantSearchTerm,
    requestSuggestions,
    receiveSuggestions,
    requestSearchResults,
    receiveSearchResults,
    toggleShowMappings
};