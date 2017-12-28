import React, { Component } from 'react';
import './App.css';
import SearchBar from './Components/SearchBar/SearchBar';
import SearchResults from './Components/SearchResults/SearchResults';
import PlayList from './Components/PlayList/PlayList';
import Spotify from './util/Spotify';

const tracks = [];
/* const tracks = [
  {
    id: '1',
    name: '1Tiny Dancer',
    artist: '1Elton John',
    album: '1Madman Across The Water',
    uri: '1https://developer.spotify.com/web-api/user-guide/#spotify-uris-ids'
  },
  {
    id: '2',
    name: '2Tiny Dancer',
    artist: '2Elton John',
    album: '2Madman Across The Water',
    uri: '2https://developer.spotify.com/web-api/user-guide/#spotify-uris-ids'
  },
  {
    id: '3',
    name: '3Tiny Dancer',
    artist: '3Elton John',
    album: '3Madman Across The Water',
    uri: '3https://developer.spotify.com/web-api/user-guide/#spotify-uris-ids'
  },
  {
    id: '4',
    name: '4Tiny Dancer',
    artist: '4Elton John',
    album: '4Madman Across The Water',
    uri: '4https://developer.spotify.com/web-api/user-guide/#spotify-uris-ids'
  }
]; */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: tracks,
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  addTrack(track) {
    if (this.state.playlistTracks.findIndex(e => e.id === track.id) === -1) {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track]
      });
    }
  }

  removeTrack(track) {
    this.setState ({
      playlistTracks: this.state.playlistTracks.filter(e => e.id !== track.id)
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(e => e.uri);
    console.log(trackURIs);
    Spotify.getAccessToken();
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.resetPlaylistState();
  }

  //Reset playlist state
  resetPlaylistState() {
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: [],
      searchResults: []
    });
  }

  search (term) {
    Spotify.getAccessToken();
    Spotify.search(term)
      .then(tracks => {
        this.setState(
          {
            searchResults: tracks
          }
        );
      });
  }

  render() {
    return (

      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch = {this.search} />
        
        <div className="App-playlist">
          <SearchResults searchResults = {this.state.searchResults} 
            onAdd = {this.addTrack} 
             />

          <PlayList playlistName = {this.state.playlistName} 
            playlistTracks = { this.state.playlistTracks}
            onRemove = {this.removeTrack}
            onNameChange = {this.updatePlaylistName}
            onSave = {this.savePlaylist} />

        </div>
      </div>
      </div>

    );
  }
}

export default App;
