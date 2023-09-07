const { getSpotifyApi } = require('./getSpotifyApi')
const fs = require('fs')

function assertSameContents(songs, classifications) {
    console.assert(songs.length == classifications.length)
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i]
        console.assert(song == classifications[i].song, `${song} != ${classifications[i].song}`)
    }
}

exports.createSpotifyPlaylists = async function () {
    const songs = fs.readFileSync('files/parsed_tracks.txt', 'utf-8').split("\n")
    const classifications = fs.readFileSync('files/classifications-1694124049.txt', 'utf-8')
        .split("\n")
        .map(c => JSON.parse(c))

    assertSameContents(songs, classifications)

    let playlists = fs.readFileSync('files/desired_playlists.txt', 'utf-8').split("\n")

    const playlistsDict = {}

    for (const p of playlists) {
        playlistsDict[p] = {}
        playlistsDict[p].track_uris = []
    }

    for (let i = 0; i < classifications.length; i++) {
        const playlist = classifications[i].classification
        if (!(playlist in playlistsDict)) {
            console.log("ERROR: unexpected playlist")
            console.log(playlist)
            return
        }
        playlistsDict[playlist].track_uris.push(classifications[i].uri)
    }

    counter = {}
    for (const p of playlists) {
        counter[p] = playlistsDict[p].track_uris.length
    }
    console.log(counter)

    return

    const timestamp = Math.round(Date.now() / 1000)

    const spotifyApi = await getSpotifyApi()

    for (const p of playlists) {
        const playlistName = p + `-${timestamp}`
        console.log(`Creating playlist ${playlistName}...`)
        const createdPlaylist = await spotifyApi.createPlaylist(playlistName, { public: false});
        playlistsDict[p].playlist_id = createdPlaylist.body.id
        console.log("Playlist ID is...")
        console.log(playlistsDict[p].playlist_id)
    }

    for (const p of playlists) {
        limit = 100
        total = playlistsDict[p].track_uris.length
        numIterations = Math.ceil(total / limit)
        for (let i = 0; i < numIterations; i++) {
            await spotifyApi.addTracksToPlaylist(
                playlistsDict[p].playlist_id,
                playlistsDict[p].track_uris.slice(i*limit, (i*limit)+limit)
            )
        }
    }
}