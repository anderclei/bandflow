const crypto = require('crypto');

const KEY = "d4c1989d3e5d4d569230df226de0bf5f";
const SECRET = "e156059a2be74e6ab5210e30989237cb";

function hmac_sha1(key, text) {
    return crypto.createHmac('sha1', key).update(text).digest('base64');
}

async function getNounIcon(query) {
    const url = "https://api.thenounproject.com/v2/icon";
    const params = {
        query: query,
        limit: "5",
        include_svg: "0"
    };

    const nonce = crypto.randomBytes(16).toString('hex');
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const baseParams = {
        oauth_consumer_key: KEY,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_version: "1.0",
        ...params
    };

    const sortedParams = Object.keys(baseParams).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(baseParams[k])}`).join('&');
    const baseString = `GET&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(SECRET)}&`;
    const signature = hmac_sha1(signingKey, baseString);

    const authHeader = `OAuth oauth_consumer_key="${KEY}", oauth_nonce="${nonce}", oauth_signature="${encodeURIComponent(signature)}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${timestamp}", oauth_version="1.0"`;

    const queryStr = Object.keys(params).map(k => `${k}=${encodeURIComponent(params[k])}`).join('&');
    try {
        const response = await fetch(`${url}?${queryStr}`, {
            headers: { 'Authorization': authHeader }
        });
        const data = await response.json();
        return data;
    } catch (err) {
        return { error: err.message };
    }
}

async function main() {
    const queries = ["drum set", "guitar amplifier", "keyboard", "microphone stand", "stage monitor"];
    const results = {};
    for (const q of queries) {
        results[q] = await getNounIcon(q);
    }
    process.stdout.write(JSON.stringify(results));
}

main();
