import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';
import {AgGridReact} from "ag-grid-react";
import sizeColumnsToFit from "./sizeColumnsToFit";
import {geneDataFactory} from "./geneDataDialog.data";

const columnMapping = {
    nucleotideChange: 'Nucleotide Change',
    proteinChange: 'Protein Change',
    otherMappings: 'Other Mappings',
    alias: 'Alias',
    region: 'Region',
    transcripts: 'Transcripts',
    reportedClassification: 'Reported Classification',
    inferredClassification: 'Inferred Classification',
    source: 'Source',
    url: 'Source Url',
    lastEvaluated: 'Last Evaluation',
    lastUpdated: 'Last Update',
    submitterComment: 'Submitter Comment',
    assembly: 'Assembly',
    chr: 'CHR',
    genomicStart: 'Genomic Start',
    genomicStop: 'Genomic Stop',
    ref: 'Reference',
    alt: 'Alternative',
    accession: 'Accession',
    reportedRef: 'Reported Reference',
    reportedAlt: 'Reported Alternative'
};

class GeneDataDialog extends Component {

    constructor(props) {
        super(props);
        this._grid = geneDataFactory();
        this._sizeColumnsToFit = sizeColumnsToFit.create({
            resizeOnceOnRowDataUpdated: true,
            autoSizeColumnsOnReady: true
        });
        this._onGridReady = this._onGridReady.bind(this);
    }

    _onGridReady(params) {
        this._sizeColumnsToFit.onGridReady(...arguments);
    };

    render() {
        let {geneData, closeDialog, isOpen} = this.props;
        if (!geneData || !isOpen) {
            return null;
        }

        const {columns, gridOptions} = this._grid;
        const {gene, nucleotideChange} = geneData;
        const rows = Object.keys(geneData)
            .filter(key => !!columnMapping[key])
            .map(key => ({field: columnMapping[key], value: geneData[key]}));

        return (
            <Modal size='lg' isOpen={isOpen} backdrop toggle={closeDialog}>
                <ModalHeader className='mb-2 border-bottom border-dark p-3' toggle={closeDialog}>
                    {`${gene} - ${nucleotideChange}`}
                </ModalHeader>
                <ModalBody>
                    <div className="ag-theme-balham">
                        <AgGridReact
                            {...gridOptions}
                            rowData={rows}
                            columnDefs={columns}
                            onGridReady={this._onGridReady}
                            onGridSizeChanged={this._sizeColumnsToFit.onGridSizeChanged}
                            onColumnResized={this._sizeColumnsToFit.onColumnResized}
                            onGridColumnsChanged={this._sizeColumnsToFit.onGridColumnsChanged}/>
                    </div>
                </ModalBody>
            </Modal>);
    }
}

GeneDataDialog.propTypes = {
    isOpen: PropTypes.bool,
    geneData: PropTypes.object,
    closeDialog: PropTypes.func
};

export default GeneDataDialog;