import React, {Component} from "react";
import PropTypes from "prop-types";
import GeneDataDialog from "../GeneDataDialog";

class GeneDataRenderer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAllData: false
        };
    }

    _toggleShowAllData = () => {
        this.setState({
            showAllData: !this.state.showAllData
        });
    };

    render() {
        const {data} = this.props;
        const {showAllData} = this.state;

        return (
            <React.Fragment>
                <GeneDataDialog isOpen={showAllData} geneData={data} closeDialog={this._toggleShowAllData}/>
                <div onClick={this._toggleShowAllData}
                     className="link-primary force-href-styling">
                    {data.gene}
                </div>
            </React.Fragment>);
    }
}

GeneDataRenderer.propTypes = {
    data: PropTypes.object.isRequired
};

export default GeneDataRenderer;