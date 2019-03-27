const columnDefs = [
    {
        headerName: "GENE",
        fields: "gene",
        valueGetter: ({data}) => data.gene
    },
    {
        headerName: "NUCLEOTIDE CHANGE",
        fields: "nucleotideChange",
        valueGetter: ({data}) => data.nucleotideChange
    }
];

const gridOptions = {
    domLayout: "autoHeight",
    suppressDragLeaveHidesColumns: true
};

function variantSearchGridFactory() {
    return {
        columnDefs,
        ...gridOptions
    }
}

export {variantSearchGridFactory};