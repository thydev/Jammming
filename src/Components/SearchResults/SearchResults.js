import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';
import SearchBar from '../SearchBar/SearchBar';

class SearchResult extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList />
                
            </div>
        );
    }
}

export default SearchResult;