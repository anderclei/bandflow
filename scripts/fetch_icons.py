import urllib.request
import urllib.parse
import json
import base64
import time
import hmac
import hashlib
import random
import string

def get_noun_project_icons(query, key, secret):
    url = "https://api.thenounproject.com/v2/icon"
    params = {
        "query": query,
        "limit": 5,
    }
    
    # Simple OAuth 1.0a implementation for Python without external libs
    nonce = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    timestamp = str(int(time.time()))
    
    base_params = {
        "oauth_consumer_key": key,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": timestamp,
        "oauth_version": "1.0",
    }
    base_params.update(params)
    
    # Sort params
    sorted_params = sorted(base_params.items())
    param_string = urllib.parse.urlencode(sorted_params)
    
    base_string = "&".join([
        "GET",
        urllib.parse.quote(url, safe=''),
        urllib.parse.quote(param_string, safe='')
    ])
    
    signing_key = urllib.parse.quote(secret, safe='') + "&"
    
    signature = base64.b64encode(
        hmac.new(signing_key.encode(), base_string.encode(), hashlib.sha1).digest()
    ).decode()
    
    auth_header = 'OAuth ' + ', '.join([
        f'{urllib.parse.quote(k)}="{urllib.parse.quote(v)}"'
        for k, v in [
            ("oauth_consumer_key", key),
            ("oauth_nonce", nonce),
            ("oauth_signature", signature),
            ("oauth_signature_method", "HMAC-SHA1"),
            ("oauth_timestamp", timestamp),
            ("oauth_version", "1.0")
        ]
    ])
    
    full_url = url + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(full_url)
    req.add_header("Authorization", auth_header)
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        return {"error": str(e)}

KEY = "d4c1989d3e5d4d569230df226de0bf5f"
SECRET = "e156059a2be74e6ab5210e30989237cb"

queries = ["drum set", "guitar amp", "keyboard synthesizer", "microphone stand", "stage monitor"]
results = {}

for q in queries:
    print(f"Searching for {q}...")
    results[q] = get_noun_project_icons(q, KEY, SECRET)
    time.sleep(1)

print(json.dumps(results, indent=2))
