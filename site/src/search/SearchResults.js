import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {factory} from "./variantSearch.data";
import {AgGridReact} from "ag-grid-react";
import sizeColumnsToFit from "./sizeColumnsToFit";

class SearchResults extends React.PureComponent {

    constructor(props) {
        super(props);
        this._grid = factory();
        this._sizeColumnsToFit = sizeColumnsToFit.create({
            resizeOnceOnRowDataUpdated: true,
            autoSizeColumnsOnReady: true
        });
        this._onGridReady = this._onGridReady.bind(this);
    }

    _onGridReady(params) {
        this.gridApi = params.api;
        this._sizeColumnsToFit.onGridReady(...arguments);
    };

    render() {
        const {rows} = this.props;
        if (!rows || rows.length === 0) {
            return null;
        }

        const {columns, gridOptions} = this._grid;

        return (
            <div className="pl-3 pt-3 ag-theme-balham">
                <AgGridReact {...gridOptions}
                             columnDefs={columns}
                             rowData={rows}
                             onGridReady={this._onGridReady}
                             onGridSizeChanged={this._sizeColumnsToFit.onGridSizeChanged}
                             onColumnResized={this._sizeColumnsToFit.onColumnsResized}
                             onGridColumnsChanged={this._sizeColumnsToFit.onGridColumnsChanged}
                />
            </div>
        );
    }
}

SearchResults.propTypes = {
    rows: PropTypes.array.isRequired
};

const mapStateToProps = ({variantSearch: {searchResults: rows}}) => ({
    rows
});

export default connect(mapStateToProps, null)(SearchResults);