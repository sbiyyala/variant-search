/* globals describe, beforeEach, it, expect, spyOn */
import React from "react";
import {shallow} from "enzyme";
import {AgGridReact} from "ag-grid-react";

import * as variantSearchData from "./variantSearch.data";
import {configureEnzyme} from "../test-utils/enzyme-utils";
import {SearchResults} from "./SearchResults";

describe('Given SearchResults component', () => {
    let wrapper, agGrid;

    beforeEach(() => {
        configureEnzyme();
        spyOn(variantSearchData, 'searchResultsFactory').and.returnValue({
            columns: [{
                col1: 'a',
                col2: 'b'
            }],
            gridOptions: {
                'suppressHorizontalScroll': true,
                'comp1': 'COMP-1'
            }
        });
    });

    describe('When results request is still in flight', () => {
        beforeEach(() => {
            wrapper = shallow(<SearchResults rows={null}/>);
            agGrid = wrapper.find(AgGridReact);
        });

        it('Then Ag Grid is loaded, with grid definitions', () => {
            expect(agGrid.length).toEqual(0);
        });
    });

    describe('When there are rows returned from search', () => {
        beforeEach(() => {
            wrapper = shallow(<SearchResults rows={[{gene: 'G-1'}]}/>);
            agGrid = wrapper.find(AgGridReact);
        });

        it('Then Ag Grid is loaded, with grid definitions', () => {
            expect(agGrid.props()).toEqual({
                suppressHorizontalScroll: true,
                comp1: 'COMP-1',
                columnDefs: [{col1: 'a', col2: 'b'}],
                rowData: [{gene: 'G-1'}],
                onGridReady: expect.any(Function),
                onGridSizeChanged: expect.any(Function),
                onColumnResized: expect.any(Function),
                onGridColumnsChanged: expect.any(Function)
            });
        });
    });
});