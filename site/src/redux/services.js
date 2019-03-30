import {ajax} from "../ajax";

function fetchVariantSuggestions(term) {
    return ajax(`/api/variant/suggest?q=${term}`)
                .then(response => response.json());
}

function fetchVariantSearchResults(term) {
    return ajax(`/api/variant/search?q=${term}`)
                .then(response => response.json());
}

export {fetchVariantSuggestions, fetchVariantSearchResults};