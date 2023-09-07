const SpotifyWebApi = require('spotify-web-api-node');

exports.getSpotifyApi = async function () {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'https://abizar.me'
    });

    const authorizeURL = await spotifyApi.createAuthorizeURL(
        ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-private', 'user-read-private', 'user-read-email', 'user-library-read'],
        'state'
    );
    console.log('Authorize URL:', authorizeURL);
    //     const browser = await puppeteer.launch({ headless: false });
    //     const page = await browser.newPage();
    //     await page.goto(authorizeURL);
    // +   await page.waitForNavigation({ url: 'https://abizar.me' });
    //     const redirectURI = page.url();
    //     await browser.close();

    // console.log('redirectURI: ' + redirectURI)
    // const authorizationCode = redirectURI.slice('https://www.abizar.me/?code='.length)
    // console.log('code: ' + authorizationCode)

    const authorizationCodeWithRedirectUri = await new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });

    const authorizationCode= authorizationCodeWithRedirectUri.slice('https://www.abizar.me/?code='.length, authorizationCodeWithRedirectUri.length - '&state=state'.length)


    console.log('authorizationCode: ' + authorizationCode)


    // const authorizationCode = 'AQBkYCcum-RTZ85H0TRu2VW2FnEoJZfn37GtLxi719wY-Mp6eotUN1Hku5sAc94CXGBvNAl0lhVFzFkBUEyzJAUxXPNf2K69IcLYHbK5w_u-9fj6XHWQY3jPms5Tdutxd_klem0RPrweKqKL6vGYRGEYNV8baXFDQVdVEP8o2nXXkcelzpR7ieSQ1srf9RwtsC4h0iWPJKLhaVYOUg5GastcrJEZzIwr2Q&state=state'

    // Request an access token using the authorization code
    const tokenData = await spotifyApi.authorizationCodeGrant(authorizationCode);
    console.log('The access token expires in ' + tokenData.body['expires_in']);
    console.log('The access token is ' + tokenData.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(tokenData.body['access_token']);
    
    return spotifyApi
}