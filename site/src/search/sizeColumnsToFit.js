import once from "lodash.once";

export default {
    create: function ({
                          resizeOnceOnRowDataUpdated,
                          autoSizeColumnsOnReady,
                          autoSizeColumnsOnRowDataUpdated
                      } = {}) {
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

        function onColumnResized({finished, source, column}) {
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

        const resizeOnRowDataUpdated = resizeOnceOnRowDataUpdated ? once(onRowDataUpdated) : onRowDataUpdated;

        return {
            onGridReady,
            onGridSizeChanged,
            onRowDataUpdated: resizeOnRowDataUpdated,
            onGridColumnsChanged,
            onColumnResized
        }
    }
}