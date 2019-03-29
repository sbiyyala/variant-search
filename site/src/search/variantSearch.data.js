import LinkRenderer from "./renderers/LinkRenderer";
import NucleotideChangeRenderer from "./renderers/NucleotideChangeRenderer";

const columns = [
    {
        headerName: "GENE",
        field: "gene",
        minWidth: 30
    },
    {
        headerName: "NUCLEOTIDE CHANGE",
        field: "nucleotideChange",
        cellRenderer: "nucleotideChangeRenderer",
        headerTooltip: "NUCLEOTIDE CHANGE"
    },
    {
        headerName: "PROTEIN CHANGE",
        field: "proteinChange",
        headerTooltip: "PROTEIN CHANGE"
    },
    {
        headerName: "ALIAS",
        field: "alias",
        headerTooltip: "ALIAS"
    },
    {
        headerName: "REGION",
        headerTooltip: "REGION",
        field: "region"
    },
    {
        headerName: "REPORTED CLASSIFICATION",
        field: "reportedClassification",
        headerTooltip: "REPORTED CLASSIFICATION"
    },
    {
        headerName: "LAST EVALUATED",
        field: "lastEvaluated",
        headerTooltip: "LAST EVALUATED"
    },
    {
        headerName: "LAST UPDATED",
        field: "lastUpdated",
        headerTooltip: "LAST UPDATED"
    },
    {
        headerName: "MORE INFO",
        field: "source",
        cellRenderer: "linkRenderer",
        headerTooltip: "MORE INFO"
    }
];

const frameworkComponents = {
    linkRenderer: LinkRenderer,
    nucleotideChangeRenderer: NucleotideChangeRenderer
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
    getRowHeight: ({data: {otherMappings, showMappings}}) => {
        return (showMappings ? otherMappings.length : 1) * 30;
    }
};

function factory() {
    return {
        columns,
        gridOptions
    }
}

export {factory};