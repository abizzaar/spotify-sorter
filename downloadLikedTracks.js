
const fs = require('fs')
const { getSpotifyApi } = require('./getSpotifyApi')


exports.downloadLikedTracks = async function () {
    // credentials are optional
    const spotifyApi = await getSpotifyApi()

    const allTracks = []

    limit = 50
    total = 1217
    num_iterations = Math.ceil(total / limit)
    for (let i = 0; i < num_iterations; i++) {
        // Get tracks in the signed in user's Liked Songs playlist
        console.log(`Iteration ${i}...`)
        let tracks = await spotifyApi.getMySavedTracks({
            limit: limit,
            offset: i*limit
        });
        
        allTracks.push(...tracks.body.items)
    }

    fs.writeFileSync('files/liked_tracks.json', JSON.stringify(allTracks));


    
    // tracks = tracks.body.items.map(t => t.track)
    // artists = tracks.map(t => t.artists[0])

    // console.log(artists)

}
