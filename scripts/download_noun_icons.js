const crypto = require('crypto');

const KEY = "d4c1989d3e5d4d569230df226de0bf5f";
const SECRET = "e156059a2be74e6ab5210e30989237cb";

function hmac_sha1(key, text) {
    return crypto.createHmac('sha1', key).update(text).digest('base64');
}

async function downloadIconSvg(iconId) {
    const url = `https://api.thenounproject.com/v2/icon/${iconId}/download`;
    const params = {
        filetype: "svg",
        color: "000000" // Added color parameter
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
        return await response.json();
    } catch (err) {
        return { error: err.message };
    }
}

async function main() {
    const ids = ["7939849", "7939843", "7939847", "4061279", "6184607"];
    const results = {};
    for (const id of ids) {
        const res = await downloadIconSvg(id);
        results[id] = res;
    }
    process.stdout.write(JSON.stringify(results, null, 2));
}

main();
