const fs = require('fs')


exports.parseLikedTracks = async function () {
    const parsedTracks = []
    const likedTracks = JSON.parse(fs.readFileSync('files/liked_tracks.json'))
    for (const t of likedTracks) {
        allArtists = t.track.artists.map(a => a.name).join(", ")
        firstArtist = t.track.artists[0].name
        parsedTracks.push(`${t.track.name} - ${firstArtist}`)
    }
    fs.writeFileSync('files/parsed_tracks.txt', parsedTracks.join("\n"))
}