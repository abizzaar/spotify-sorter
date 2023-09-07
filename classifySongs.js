const fs = require('fs');
const OpenAI = require("openai")

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function buildPrompt(playlists, songs) {
    return `Classify this song into one of the following playlists.

    Playlists:
    ${playlists.join("\n")}
    
    Input Songs:
    ${songs.join("\n")}
    Output playlists: `
} 

exports.classifySongs = async function () {
    const playlists = fs.readFileSync('files/desired_playlists.txt', 'utf-8').split("\n")
    const songs = fs.readFileSync('files/parsed_tracks.txt', 'utf-8').split("\n")
    const answers = []
    const playlistsDict = {}
    for (const p of playlists) {
        playlistsDict[p] = 0
    }
    total = songs.length
    limit = 10
    numIterations = Math.ceil(total / limit)
    for (let i = 0; i < numIterations; i++) {
        console.log(`Iteration ${i}`)
        const chunkedSongs = songs.slice(i*limit, (i*limit)+limit)
        const prompt = buildPrompt(playlists, chunkedSongs)
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });
        answer = chatCompletion.choices[0].message.content
        const chunkedClassifications = answer.split("\n")
        for (const classification of chunkedClassifications) {
            answers.push(classification)
            playlistsDict[classification] += 1
        }
    }

    console.log("PLAYLISTS DICT")
    console.log(playlistsDict)

    timestamp = Math.round(Date.now() / 1000)
    fs.writeFileSync(`files/classifications-${timestamp}.txt`, answers.join("\n"))
}