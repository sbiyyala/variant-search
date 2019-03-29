import once from "lodash.once";

export default {
    create: function ({
                          resizeOnceOnRowDataUpdated,
                          autoSizeColumnsOnReady,
                          autoSizeColumnsOnRowDataUpdated
                      }) {
        let api;
        let columnApi;
        let resizingInProgress = false;
        let resizingColumn = null;

        function resizeGrid({autoSizeColumns, lastExcludeColumn} = {}) {
            if (api) {
                if (!resizingInProgress) {
                    resizingInProgress = true;

                    let savedSuppressSizeToFit;
                    const excludeColumnsRef = lastExcludeColumn && columnApi.getAllGridColumns()
                        .filter(c => c.left < lastExcludeColumn.left);
                    if (lastExcludeColumn) {
                        savedSuppressSizeToFit = excludeColumnsRef.map(c => c.colDef.suppressSizeToFit);
                        excludeColumnsRef.forEach(c => {
                            c.colDef.suppressSizeToFit = true;
                        });
                    }

                    if (autoSizeColumns && columnApi) {
                        const columns = columnApi.getAllGridColumns()
                            .filter(c => !c.colDef.suppressSizeToFit)
                            .map(c => c.colId);
                        columnApi.autoSizeColumns(columns);
                    }

                    api.sizeColumnsToFit();

                    if (lastExcludeColumn) {
                        excludeColumnsRef.forEach((c, i) => {
                            c.colDef.suppressSizeToFit = savedSuppressSizeToFit[i];
                        });
                    }

                    setTimeout(() => {
                        resizingInProgress = false;
                    });
                }
            }
        }

        function onGridReady(event) {
            api = event.api;
            columnApi = event.columnApi;
            resizeGrid({autoSizeColumns: autoSizeColumnsOnReady});
        }

        function onGridSizeChanged() {
            setTimeout(resizeGrid);
        }

        function onGridColumnsChanged() {
            resizeGrid();
        }

        function onRowDataUpdated() {
            resizeGrid({autoSizeColumns: autoSizeColumnsOnRowDataUpdated});
        }

        function onColumnsResized({finished, source, column}) {
            if (!finished && source === 'uiColumnDragged' && column) {
                resizingColumn = column;
            }

            if (finished && source === 'uiColumnDragged' && (column || resizingColumn)) {
                column = column || resizingColumn;
                resizeGrid({lastExcludeColumn: column});
            }

            if (finished) {
                resizingColumn = null;
            }
        }

        function applyColumnWidthWeights(weights) {
            if (columnApi) {
                const colIdToWeight = (weights || []).reduce((acc, item) => {
                    acc[item.name] = item.width;
                    return acc;
                }, {});

                Object.keys(colIdToWeight).forEach(colId => {
                    const weight = colIdToWeight[colId];
                    const column = columnApi.getAllGridColumns().find(c => c.getColId() === colId);
                    if (column) {
                        const actualWidth = column && column.getActualWidth();
                        if (weight && (weight !== actualWidth)) {
                            columnApi.setColumnWidth(colId, weight, true);
                        }
                    }
                });
            }
        }

        function sizeDefFromActualColumn(column) {
            if (columnApi) {
                const actualColumn = columnApi.getAllGridColumns().find(c => c.getColId() === column.colId);
                return actualColumn ? {...column, ...{width: actualColumn.getActualWidth()}} : column;
            }

            return column;
        }

        const resizeOnRowDataUpdated = resizeOnceOnRowDataUpdated ? once(onRowDataUpdated) : onRowDataUpdated;

        const autoSizeGridProps = {
            onGridReady,
            onGridSizeChanged,
            onRowDataUpdated: resizeOnRowDataUpdated
        };

        return {
            onGridReady,
            onGridSizeChanged,
            onRowDataUpdated: resizeOnRowDataUpdated,
            onGridColumnsChanged,
            sizeDefFromActualColumn,
            applyColumnWidthWeights,
            autoSizeGridProps,
            onColumnsResized
        }
    }
}