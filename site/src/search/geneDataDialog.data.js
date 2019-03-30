import {chunkString} from "./utils";
import ValueRenderer from "./renderers/ValueRenderer";

const columns = [
    {
        headerName: 'Attribute',
        field: 'field',
        minWidth: 40,
        maxWidth: 160
    },
    {
        headerName: 'Value',
        field: 'value',
        cellRenderer: "valueRenderer",
        autoHeight: true
    }
];

const frameworkComponents = {
    valueRenderer: ValueRenderer
};

const gridOptions = {
    frameworkComponents,
    suppressHorizontalScroll: true,
    domLayout: "autoHeight",
    suppressDragLeaveHidesColumns: true,
    suppressRowTransform: true,
    defaultColDef: {
        resizable: true,
        sortable: true
    },
    getRowHeight: ({data: {value}}) => {
        return chunkString(value, 100).length * 26;
    }
};

function geneDataFactory() {
    return {
        columns,
        gridOptions
    }
}

export {geneDataFactory};