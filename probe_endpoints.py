import urllib.request
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

endpoints = [
    "https://stitch.withgoogle.com/api/share/projects/2637541554849255325",
    "https://stitch.withgoogle.com/api/share/2637541554849255325",
    "https://stitch.withgoogle.com/api/projects/2637541554849255325",
    "https://stitch.withgoogle.com/api/share/project/2637541554849255325",
    "https://stitch.withgoogle.com/api/project/2637541554849255325",
    "https://stitch.withgoogle.com/api/p/2637541554849255325",
]

for ep in endpoints:
    print(f"Trying {ep}...")
    req = urllib.request.Request(ep, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            print(f"  SUCCESS! Status: {response.status}, Length: {len(data)}")
            # Show first 200 chars or parse json
            try:
                js = json.loads(data)
                print(f"  JSON keys: {list(js.keys())}")
                if 'screens' in js:
                    print(f"  Found {len(js['screens'])} screens!")
                # save success
                with open("c:/Users/devv/.gemini/antigravity-ide/scratch/success_api.json", "w") as f:
                    f.write(data)
            except:
                print(f"  Not JSON. First 100 chars: {data[:100]}")
    except Exception as e:
        print(f"  FAILED: {e}")
