/* globals describe, beforeEach, it, expect */
import sizeColumnsToFit from "./sizeColumnsToFit";

describe('Given sizeColumnsToFit object with onGridReady', function () {
    let target,
        columns,
        oldColumns,
        actual,
        expected;

    beforeEach(() => {
        jest.useFakeTimers();
        target = sizeColumnsToFit.create();
        const event = {
            api: {
                sizeColumnsToFit: () => {
                    actual = JSON.parse(JSON.stringify(columns));
                }
            },
            columnApi: {
                getAllGridColumns: () => columns
            }
        };
        columns = [
            {
                "colId": "A",
                left: 100,
                colDef: {suppressSizeToFit: false}
            },
            {
                "colId": "B",
                left: 200,
                colDef: {suppressSizeToFit: false}
            },
            {
                "colId": "C",
                left: 300,
                colDef: {suppressSizeToFit: false}
            }
        ];

        target.onGridReady(event);
        jest.runAllTimers();
    });

    describe("When a column is resized", () => {
        beforeEach(() => {
            oldColumns = JSON.parse(JSON.stringify(columns));
            expected = [
                {
                    "colDef": {
                        suppressSizeToFit: true
                    },
                    "colId": "A",
                    "left": 100
                },
                {
                    "colDef": {
                        suppressSizeToFit: false
                    },
                    "colId": "B",
                    "left": 200
                },
                {
                    "colDef": {
                        suppressSizeToFit: false
                    },
                    "colId": "C",
                    "left": 300
                }
            ];
            target.onColumnResized({
                finished: true,
                source: "uiColumnDragged",
                column: {
                    colId: "b",
                    left: 200,
                    colDef: {suppressSizeToFit: false}
                }
            });
        });

        it('Then sizeColumnsToFit is called with suppressSizeToFit as true for the resized column and columns on its ' +
            'left', () => {
            expect(actual).toEqual(expected);
        });

        it('Then properties are reverted at the end', () => {
            expect(columns).toEqual(oldColumns);
        });
    });
});