import LinkRenderer from "./LinkRenderer";

const columns = [
    {
        headerName: "GENE",
        field: "gene"
    },
    {
        headerName: "NUCLEOTIDE CHANGE",
        field: "nucleotideChange"
    },
    {
        headerName: "PROTEIN CHANGE",
        field: "proteinChange"
    },
    {
        headerName: "ALIAS",
        field: "alias"
    },
    {
        headerName: "REGION",
        field: "region"
    },
    {
        headerName: "REPORTED CLASSIFICATION",
        field: "reportedClassification"
    },
    {
        headerName: "LAST EVALUATED",
        field: "lastEvaluated"
    },
    {
        headerName: "LAST UPDATED",
        field: "lastUpdated"
    },
    {
        headerName: "MORE INFO",
        field: "source",
        cellRenderer: "linkRenderer"
    }
];

const frameworkComponents = {
    linkRenderer: LinkRenderer
};

const gridOptions = {
    frameworkComponents,
    suppressHorizontalScroll: true,
    enableSorting: true,
    domLayout: "autoHeight",
    suppressDragLeaveHidesColumns: true
};

function factory() {
    return {
        columns,
        gridOptions
    }
}

export {factory};