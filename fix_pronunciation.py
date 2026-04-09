#!/usr/bin/env python3
"""
Fix mispronounced Georgian audio files.
Strategy: wrap hard consonant clusters in natural sentence context
so ElevenLabs gets enough phonetic signal to pronounce correctly.

Usage: python3 fix_pronunciation.py YOUR_API_KEY
"""

import urllib.request, json, os, sys, time

API_KEY  = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('ELEVENLABS_API_KEY', '')
VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'   # Alice
MODEL    = 'eleven_multilingual_v2'
OUT      = os.path.join(os.path.dirname(__file__), 'audio')

if not API_KEY:
    print('Usage: python3 fix_pronunciation.py <API_KEY>')
    sys.exit(1)

# ── Override map ──────────────────────────────────────────────────────────────
# Key: filename without .mp3
# Value: (text_to_send, voice_settings_overrides)
#
# Technique: put hard words in natural Georgian sentence context so the model
# has enough phonetic signal around the cluster to pronounce it correctly.
# ─────────────────────────────────────────────────────────────────────────────
FIXES = {

    # გმ cluster — "Jimadlob" bug
    # Wrapping in exclamatory context forces hard /g/ before /m/
    'phrase_p0': ('გმადლობ!',                      {'stability': 0.88, 'speed': 0.82}),
    'phrase_p1': ('გმადლობთ!',                     {'stability': 0.88, 'speed': 0.82}),
    'phrase_g6': ('კარგად ვარ, გმადლობ!',          {'stability': 0.88, 'speed': 0.85}),

    # გთ cluster — extreme stack of consonants
    # Sentence context: "შემოდით, გთხოვთ" = "Come in, please"
    'phrase_p6': ('შემოდით, გთხოვთ',               {'stability': 0.92, 'speed': 0.80}),

    # წყ cluster — ejective + uvular
    'word_9':    ('წყალი, წყალი!',                 {'stability': 0.88, 'speed': 0.80}),
    'phrase_f3': ('წყალი, გთხოვთ!',               {'stability': 0.88, 'speed': 0.85}),

    # ძმ cluster — voiced affricate + nasal
    'word_20':   ('ჩემი ძმა',                       {'stability': 0.85, 'speed': 0.82}),

    # მდ cluster
    'word_5':    ('ეს მდინარეა',                    {'stability': 0.85, 'speed': 0.82}),

    # Long complex word — repeat for clarity
    'word_16':   ('ბოსტნეული, ბოსტნეული',          {'stability': 0.85, 'speed': 0.80}),

    # Isolated single letters that ElevenLabs might read poorly —
    # use them in example word context (slower speed for letters)
    'letter_22': ('ღ — ღვინო',                     {'stability': 0.90, 'speed': 0.70}),  # voiced velar fric.
    'letter_23': ('ყ — ყავა',                      {'stability': 0.90, 'speed': 0.70}),  # uvular ejective
    'letter_28': ('წ — წყალი',                     {'stability': 0.90, 'speed': 0.70}),  # ejective ts
    'letter_29': ('ჭ — ჭამა',                      {'stability': 0.90, 'speed': 0.70}),  # ejective ch
    'letter_27': ('ძ — ძმა',                       {'stability': 0.90, 'speed': 0.70}),  # voiced ts
    'letter_9':  ('კ — კაცი',                      {'stability': 0.90, 'speed': 0.70}),  # ejective k
    'letter_14': ('პ — პური',                      {'stability': 0.90, 'speed': 0.70}),  # ejective p
    'letter_18': ('ტ — ტყე',                       {'stability': 0.90, 'speed': 0.70}),  # ejective t
}


def tts(filename, text, settings):
    mp3 = os.path.join(OUT, f'{filename}.mp3')

    base = {'stability': 0.85, 'similarity_boost': 0.80,
            'style': 0.0, 'use_speaker_boost': True, 'speed': 0.82}
    base.update(settings)

    payload = json.dumps({
        'text': text,
        'model_id': MODEL,
        'voice_settings': base,
    }).encode()

    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}',
        data=payload,
        headers={'xi-api-key': API_KEY,
                 'Content-Type': 'application/json',
                 'Accept': 'audio/mpeg'},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
        with open(mp3, 'wb') as f:
            f.write(data)
        print(f'  OK  {filename}.mp3  ({len(data)//1024}KB)  text="{text}"')
        time.sleep(0.3)
    except Exception as e:
        print(f'  ERR {filename}: {e}')


print(f'Fixing {len(FIXES)} files...\n')
for filename, (text, settings) in FIXES.items():
    tts(filename, text, settings)

print('\nDone! Deploy:')
print('  git add audio/ && git commit -m "fix: improve Georgian pronunciation" && git push')
