const fs = require("fs")
const OpenAI = require("openai")

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.generateGenreClassifications = async function () {
    const genres = new Set()

    let tracks = fs.readFileSync('files/parsed_tracks.txt', 'utf-8').split("\n")

    llmPrompt = `Classify the following songs into 10 Spotify playlists. Don't mention which playlist you're adding which song to,
    just list each playlist name separated by a newline. Don't add numbers or bullet points before the playlist names.`

    limit = 100
    total = tracks.length
    numIterations = Math.ceil(total / limit)
    for (i = 0; i < numIterations; i++) {
        console.log(`Iteration ${i}...`)
        chunkedTracks = tracks.slice(i*limit,(i*limit)+limit)
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: llmPrompt + chunkedTracks.join("\n") + "\nOutput:\n" }],
            model: "gpt-3.5-turbo",
        });
        answer = chatCompletion.choices[0].message.content
        chunkedGenres = answer.split("\n")
        for (let g of chunkedGenres) {
            genres.add(g)
        }
    }

    fs.writeFileSync('files/genres.txt', [...genres].join("\n"))
}