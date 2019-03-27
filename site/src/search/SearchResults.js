import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class SearchResults extends React.PureComponent {

    render() {
        const {rows} = this.props;

        if(!rows || rows.length === 0) {
            return null;
        }

        const variants = rows.map(({
                                       gene, nucleotideChange, proteinChange,
                                       alias, region, reportedClassification,
                                       lastEvaluated, lastUpdated, url, source
                                   },
                                   idx) => {

            return (
                <tr key={`row-${idx}`}>
                    <td className="px-5">{gene}</td>
                    <td className="px-5">{nucleotideChange}</td>
                    <td className="px-5">{proteinChange}</td>
                    <td className="px-5">{alias}</td>
                    <td className="px-5">{region}</td>
                    <td className="px-5">{reportedClassification}</td>
                    <td className="px-5">{lastEvaluated}</td>
                    <td className="px-5">{lastUpdated}</td>
                    <td className="px-5"><a href={url} target="_blank" rel="noopener noreferrer">{source}</a></td>
                </tr>);
        });
        return (
            <div className="pl-2 pt-5">
                <table>
                    <thead>
                    <tr className="border-bottom px-1">
                        <th className="px-5">GENE</th>
                        <th className="px-5">NUCLEOTIDE CHANGE</th>
                        <th className="px-5">PROTEIN CHANGE</th>
                        <th className="px-5">ALIAS</th>
                        <th className="px-5">REGION</th>
                        <th className="px-5">REPORTED CLASSIFICATION</th>
                        <th className="px-5">LAST EVALUATED</th>
                        <th className="px-5">LAST UPDATED</th>
                        <th className="px-5">MORE INFO</th>
                    </tr>
                    </thead>
                    <tbody>
                    {variants}
                    </tbody>
                </table>

            </div>);
    }
}

SearchResults.propTypes = {
    rows: PropTypes.array.isRequired
};

const mapStateToProps = ({variantSearch: {searchResults: rows}}) => ({
    rows
});

export default connect(mapStateToProps, null)(SearchResults);