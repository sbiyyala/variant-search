import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {toggleShowMappings} from "../../redux/variantSearch";

const NucleotideChangeRenderer = ({data, toggleShowMappings}) => {
    const {nucleotideChange, otherMappings, showMappings} = data;

    if (!nucleotideChange) {
        return null;
    }

    const renderOtherMappings = showMappings
        ? (otherMappings || [])
            .filter(elem => elem !== nucleotideChange)
            .map((elem, idx) => <div className="pl-2" key={idx}>{elem}</div>)
        : null;

    const mode = <span
        className="material-icons icon-baseline force-href-styling pl-0"
        onClick={() => toggleShowMappings(nucleotideChange)}>{`keyboard_arrow_${showMappings ? 'down' : 'right'}`}
    </span>;

    const hasMappings = otherMappings.length > 1;
    return (
        <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
                {hasMappings ? mode : null}
                <span className={`pl-${hasMappings ? 0 : 2}`}>
                        {nucleotideChange}
                    </span>
            </div>
            {renderOtherMappings}
        </div>);
};

NucleotideChangeRenderer.propTypes = {
    data: PropTypes.object.isRequired,
    toggleShowMappings: PropTypes.func.isRequired
};


export default connect(null, {toggleShowMappings})(NucleotideChangeRenderer);