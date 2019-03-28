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
            resizeOnceOnRowDataUpdated: true
        });
        //this._grid.sizeColumnsToFit();
    }

    render() {
        const {rows} = this.props;
        if(!rows || rows.length === 0) {
            return null;
        }

        const {columns, gridOptions} = this._grid;

        return (
            <div className="pl-2 pt-5">
                <AgGridReact {...gridOptions}
                columnDefs={columns}
                rowData={rows}/>
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