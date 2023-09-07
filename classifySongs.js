const fs = require('fs');
const OpenAI = require("openai")

function buildPrompt(playlists, song) {
    return `Classify this song into one of the following playlists.

    Playlists:
    ${playlists.join("\n")}
    
    Input Song: ${song}
    Output playlist: `
} 

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.classifySongs = async function () {
    const playlists = fs.readFileSync('files/desired_playlists.txt', 'utf-8').split("\n")
    const songs = fs.readFileSync('files/parsed_tracks.txt', 'utf-8').split("\n")
    const tracks = JSON.parse(fs.readFileSync('files/liked_tracks.json'))
    const playlistsDict = {}
    for (const p of playlists) {
        playlistsDict[p] = 0
    }
    timestamp = Math.round(Date.now() / 1000)
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i]
        const track = tracks[i]
        console.log(`Iteration ${i}`)
        const prompt = buildPrompt(playlists, song) 
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 20
        });
        answer = chatCompletion.choices[0].message.content
        dct = {
            song: song,
            uri: track.track.uri,
            classification: answer
        }
        fs.appendFileSync(`files/classifications-${timestamp}.txt`, JSON.stringify(dct) + "\n")
        playlistsDict[answer] += 1
    }

    console.log(playlistsDict)
}