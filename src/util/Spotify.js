
const client_id = '8d13e47a54354ce48fb3e5b74df0c61b';
let userAccessToken = '';

const redirect_uri = 'http://localhost:3000/';
const scope = 'playlist-modify-private playlist-modify-public';
const response_type = 'token';

const urlEndPoint = 'https://accounts.spotify.com/authorize?' 
        + 'client_id=' + client_id + '&redirect_uri=' + redirect_uri
        + '&scope=' + scope 
        + '&response_type=' + response_type;

const Spotify = {
    getAccessToken () {
        if (userAccessToken !== '') {
            console.log('empty');
            return userAccessToken;
        } else if (window.location.href.match(/access_token=([^&]*)/)){
            //Check the URL to see if the access token has just been obtained.
            const callbackUrl = window.location.href;
            userAccessToken = callbackUrl.match(/access_token=([^&]*)/)[1];
            const expires_in = callbackUrl.match(/expires_in=([^&]*)/)[1];

            window.setTimeout(() => { 
                userAccessToken = '';
                
            }, expires_in * 1000);

            //Always clear the first time result 
            console.log('token')
            window.history.pushState('Access Token', null, '/');
        } else {
            //Open new window
            console.log('new login');
            window.location = urlEndPoint;
        }
    },

    search (term) {
        /* if (userAccessToken === '') {
            this.getAccessToken();
        } */

        return fetch('https://api.spotify.com/v1/search?type=track&q=' + term,
            { 
                headers: {
                    'Authorization' : 'Bearer ' + userAccessToken
                }
            })
            .then(response => response.json())
            .then(jsonResponse => {
                
                if(jsonResponse.tracks) {
                    return jsonResponse.tracks.items.map(track => {
                        return {
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        }
                    })
                }
            });
    },

    savePlaylist(playlistName, trackUris) {
        
        async function createPlaylist () {
            try {
                let response = await fetch('https://api.spotify.com/v1/me',
                { 
                    headers: {
                        'Authorization' : 'Bearer ' + userAccessToken
                    }
                });
               
                if (response.ok) {
                    let jsonResponse = await response.json();
                    const userid =  jsonResponse.id;
                    let responseList = await fetch('https://api.spotify.com/v1/users/'+ userid + '/playlists',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization' : 'Bearer ' + userAccessToken,
                            'Content-Type' : 'application/json'
                        },
                        dataType: 'json',
                        body: JSON.stringify({
                            'name': playlistName,
                            'public': false
                        })
                    });
                    if (responseList.ok) {
                        let jsonResponseList = await responseList.json();
                        const playlistid = jsonResponseList.id;
                        let responseSnap = await fetch('https://api.spotify.com/v1/users/'+ userid + '/playlists/' + playlistid + '/tracks',
                        {
                            method: 'POST',
                            headers: {
                                'Authorization' : 'Bearer ' + userAccessToken,
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                'uris': trackUris
                            })
                        });
                        
                        if (responseSnap.ok) {
                            console.log(responseSnap.status);
                            let jsonResponseSnap = await responseSnap.json();
                            console.log(jsonResponseSnap.snapshot_id);
                            return responseSnap.status;
                        }

                    }
                }
            } catch(error) {
                console.log(error);
            }
        };

        if (playlistName !== '' && trackUris.length > 0) {

            return createPlaylist();
            
        }
        return -1;
    }
};


export default Spotify;