import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {toggleShowMappings} from "../../redux/variantSearch";

class NucleotideChangeRenderer extends React.PureComponent {

    render() {
        const {data, toggleShowMappings} = this.props;
        const {nucleotideChange, otherMappings, showMappings} = data;

        if (!nucleotideChange) {
            return null;
        }

        const renderOtherMappings = showMappings
            ? (otherMappings || [])
                .filter(elem => elem !== nucleotideChange)
                .map((elem, idx) => <div key={idx}>{elem}</div>)
            : null;

        const mode = <span
            className="material-icons icon-baseline"
            onClick={() => toggleShowMappings(nucleotideChange)}>{`keyboard_arrow_${showMappings ? 'down' : 'right'}`}</span>;

        return (
            <div className="d-flex flex-column">
                <div className="flex-row align-items-center">
                    {mode}
                    <span className="pl-0">
                        {nucleotideChange}
                    </span>
                </div>
                {renderOtherMappings}
            </div>);
    }
}

NucleotideChangeRenderer.propTypes = {
    data: PropTypes.object.isRequired,
    toggleShowMappings: PropTypes.func.isRequired
};


export default connect(null, {toggleShowMappings})(NucleotideChangeRenderer);