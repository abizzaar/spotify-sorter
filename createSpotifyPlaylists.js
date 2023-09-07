const { getSpotifyApi } = require('./getSpotifyApi')

exports.createSpotifyPlaylists = async function () {

    exports.createSpotifyPlaylists = async function () {
        const spotifyApi = await getSpotifyApi()
        const userId = '226bm6blt2m64iz24stliv5ui'

        const playlists = fs.readFileSync('files/desired_playlists.txt', 'utf-8').split("\n")
        const songs = JSON.parse(fs.readFileSync('files/liked_tracks.json'))
        const classifiedPlaylists = fs.readFileSync('files/classifications.txt', 'utf-8').split("\n")

        const playlistsDict = {}
    
        for (const p of playlists) {
            const playlistName = p + `-${Math.round(Date.now() / 1000)}`
            playlistsDict[p] = {}
            playlistsDict[p].track_uris = []
        }

        for (let i = 0; i < songs.length; i++) {
            const track = songs[i]
            // const playlistId = playlistIds[classifiedPlaylists[i]]
            playlistsDict[p].track_uris.push(track.track.uri)
        }

        console.log(playlistsDict)

        // const createdPlaylist = await spotifyApi.createPlaylist(userId, playlistName);

        // spotifyApi.addTracksToPlaylist(
        //     userId,
        //     playlistId,
        //     [track.track.uri] // TODO: batch
        // )
    }
}