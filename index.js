require('dotenv').config();
const { downloadLikedTracks } = require('./downloadLikedTracks');
const { parseLikedTracks } = require('./parseLikedTracks')
const { generateGenreClassifications } = require('./generateGenreClassifications')
const {classifySongs} = require("./classifySongs")
// downloadLikedTracks()
// parseLikedTracks()
// generateGenreClassifications()
classifySongs()
