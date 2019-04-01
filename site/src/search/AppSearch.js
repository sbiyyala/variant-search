import React from 'react';
import PropTypes from 'prop-types';
import {requestSuggestions, requestSearchResults, setVariantSearchTerm} from "../redux/variantSearch";
import Select from "react-select";
import {connect} from "react-redux";

function formatSuggestions(response = []) {
    return response.map(({gene: label}, value) => ({label, value}));
}

class AppSearch extends React.PureComponent {

    constructor(props) {
        super(props);
        this._selectRef = React.createRef();
    }

    _suggestions = (response) => {
        return formatSuggestions(response) || [];
    };

    _onClear = () => null;

    _onChange = (selectedOption) => {
        if (!selectedOption) {
            return;
        }

        const {requestSearchResults} = this.props;
        const {label: gene} = selectedOption;
        requestSearchResults(gene);
    };

    _onInputChange = (searchText) => {
        const {setVariantSearchTerm, requestSuggestions} = this.props;
        setVariantSearchTerm(searchText);
        if (searchText) {
            requestSuggestions();
        }
    };

    _onFocus = () => {
        this._selectRef.current.select.clearValue();
        const {setVariantSearchTerm} = this.props;
        setVariantSearchTerm("");

    };

    render() {
        const {searchText, suggestions, isLoading} = this.props;

        return (
            <div className=" mt-4">
                <div className="row">
                    <div className="col-md-4"/>
                    <div className="col-md-4">
                        <Select options={this._suggestions(suggestions)}
                                placeholder="Search Variants"
                                maxMenuHeight={500}
                                openMenuOnClick={true}
                                onInputChange={this._onInputChange}
                                onChange={this._onChange}
                                ref={this._selectRef}
                                menuIsOpen={searchText}
                                inputValue={searchText}
                                isLoading={isLoading}
                                onFocus={this._onFocus}
                        />
                    </div>
                    <div className="col-md-4"/>
                </div>
            </div>
        );
    }
}

AppSearch.propTypes = {
    query: PropTypes.string,
    searchText: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    suggestions: PropTypes.array.isRequired,
    setVariantSearchTerm: PropTypes.func.isRequired,
    requestSuggestions: PropTypes.func.isRequired,
    requestSearchResults: PropTypes.func.isRequired
};

const mapStateToProps = ({variantSearch: {searchText, isLoading, suggestions}}) => ({
    searchText,
    isLoading,
    suggestions
});

const mapDispatchToProps = {setVariantSearchTerm, requestSuggestions, requestSearchResults};

export default connect(mapStateToProps, mapDispatchToProps)(AppSearch);