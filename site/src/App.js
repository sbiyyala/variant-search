import React from 'react';
import AppSearch from "./search/AppSearch";
import SearchResults from "./search/SearchResults";
import AppNotifications from "./redux/AppNotifications";

const App = () => (
    <React.Fragment>
        <AppSearch/>
        <SearchResults/>
        <AppNotifications/>
    </React.Fragment>
);

export default App;