#!/usr/bin/env python3
"""
Generate Georgian TTS audio files via ElevenLabs API.

Setup:
  1. Free account at https://elevenlabs.io (no credit card)
  2. Settings → API Keys → copy key
  3. Run: python3 generate_audio_elevenlabs.py YOUR_API_KEY
"""

import urllib.request, urllib.error, json, os, sys, time

API_KEY  = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('ELEVENLABS_API_KEY', '')
VOICE_ID = 'XB0fDUnXU5powFXDhCwa'   # "Charlotte" — multilingual, clear female voice
MODEL    = 'eleven_multilingual_v2'
OUT      = os.path.join(os.path.dirname(__file__), 'audio')

if not API_KEY:
    print('Usage: python3 generate_audio_elevenlabs.py <API_KEY>')
    print('Get your free key at: https://elevenlabs.io → Settings → API Keys')
    sys.exit(1)

os.makedirs(OUT, exist_ok=True)

def tts(filename, text, slow=False):
    mp3 = os.path.join(OUT, f'{filename}.mp3')
    if os.path.exists(mp3):
        print(f'  skip  {filename}.mp3')
        return True

    payload = json.dumps({
        'text': text,
        'model_id': MODEL,
        'voice_settings': {
            'stability': 0.65,
            'similarity_boost': 0.80,
            'style': 0.0,
            'use_speaker_boost': True,
            'speed': 0.80 if slow else 0.90,
        }
    }).encode()

    url = f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}'
    req = urllib.request.Request(url, data=payload, headers={
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
    })

    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
        with open(mp3, 'wb') as f:
            f.write(data)
        print(f'  OK    {filename}.mp3  ({len(data)//1024}KB)')
        time.sleep(0.25)   # gentle rate limit
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'  ERROR {filename}: HTTP {e.code} — {body[:120]}')
        return False
    except Exception as e:
        print(f'  ERROR {filename}: {e}')
        return False

# ── Check quota before starting ──
def check_quota():
    req = urllib.request.Request(
        'https://api.elevenlabs.io/v1/user/subscription',
        headers={'xi-api-key': API_KEY}
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read())
        used  = data.get('character_count', 0)
        limit = data.get('character_limit', 0)
        print(f'ElevenLabs quota: {used}/{limit} chars used  ({limit-used} remaining)\n')
        if limit - used < 1500:
            print('WARNING: Less than 1500 chars remaining — might not complete!')
    except Exception as e:
        print(f'Could not check quota: {e}\n')

check_quota()

# ────────────────────────────────────────────────────────────────
# ALPHABET — 33 letters, spoken slowly
LETTERS = [
    'ა','ბ','გ','დ','ე','ვ','ზ','თ','ი','კ','ლ','მ','ნ','ო','პ',
    'ჟ','რ','ს','ტ','უ','ფ','ქ','ღ','ყ','შ','ჩ','ც','ძ','წ','ჭ','ხ','ჯ','ჰ',
]

print('=== Letters (33) ===')
for i, letter in enumerate(LETTERS):
    tts(f'letter_{i}', letter, slow=True)

# ────────────────────────────────────────────────────────────────
# FLASHCARD WORDS
WORDS = [
    (0,  'სახლი'),    (1,  'ქუჩა'),     (2,  'ქალაქი'),   (3,  'მთა'),
    (4,  'ზღვა'),     (5,  'მდინარე'),  (6,  'ტყე'),      (7,  'ცა'),
    (8,  'მზე'),      (9,  'წყალი'),    (10, 'პური'),     (11, 'ყავა'),
    (12, 'ღვინო'),    (13, 'ხინკალი'),  (14, 'ხაჭაპური'), (15, 'ხილი'),
    (16, 'ბოსტნეული'),(17, 'დედა'),     (18, 'მამა'),     (19, 'და'),
    (20, 'ძმა'),      (21, 'მეგობარი'), (22, 'კაცი'),     (23, 'ქალი'),
    (24, 'ბავშვი'),   (25, 'ერთი'),     (26, 'ორი'),      (27, 'სამი'),
    (28, 'ოთხი'),     (29, 'ხუთი'),     (30, 'ექვსი'),    (31, 'შვიდი'),
    (32, 'რვა'),      (33, 'ცხრა'),     (34, 'ათი'),      (35, 'კარგი'),
    (36, 'ცუდი'),     (37, 'დიდი'),     (38, 'პატარა'),   (39, 'ლამაზი'),
    (40, 'ახალი'),    (41, 'ძველი'),    (42, 'ცხელი'),    (43, 'ცივი'),
]

print('\n=== Words (44) ===')
for idx, word in WORDS:
    tts(f'word_{idx}', word, slow=True)

# ────────────────────────────────────────────────────────────────
# PHRASES
PHRASES = [
    ('phrase_g0', 'გამარჯობა'),
    ('phrase_g1', 'გამარჯობათ'),
    ('phrase_g2', 'სალამი'),
    ('phrase_g3', 'ნახვამდის'),
    ('phrase_g4', 'კარგად იყავი'),
    ('phrase_g5', 'როგორ ხარ?'),
    ('phrase_g6', 'კარგად, გმადლობ'),
    ('phrase_p0', 'გმადლობ'),
    ('phrase_p1', 'გმადლობთ'),
    ('phrase_p2', 'დიდი მადლობა'),
    ('phrase_p3', 'ბოდიში'),
    ('phrase_p4', 'კი'),
    ('phrase_p5', 'არა'),
    ('phrase_p6', 'გთხოვთ'),
    ('phrase_p7', 'არაფერს'),
    ('phrase_f0', 'ხინკალი'),
    ('phrase_f1', 'ხაჭაპური'),
    ('phrase_f2', 'ღვინო'),
    ('phrase_f3', 'წყალი'),
    ('phrase_f4', 'ყავა'),
    ('phrase_f5', 'ჩაი'),
    ('phrase_f6', 'პური'),
    ('phrase_f7', 'ანგარიში, გთხოვთ'),
    ('phrase_f8', 'გემრიელია!'),
    ('phrase_f9', 'გაუმარჯოს!'),
    ('phrase_n0', 'სად არის?'),
    ('phrase_n1', 'მარცხნივ'),
    ('phrase_n2', 'მარჯვნივ'),
    ('phrase_n3', 'პირდაპირ'),
    ('phrase_n4', 'ახლოს'),
    ('phrase_n5', 'შორს'),
    ('phrase_n6', 'მეტრო'),
    ('phrase_n7', 'ავტობუსი'),
    ('phrase_n8', 'ტაქსი'),
    ('phrase_n9', 'სასტუმრო'),
    ('phrase_s0', 'რამდენი ღირს?'),
    ('phrase_s1', 'ძვირია'),
    ('phrase_s2', 'იაფია'),
    ('phrase_s3', 'მინდა'),
    ('phrase_e0', 'დამეხმარეთ!'),
    ('phrase_e1', 'ექიმი'),
    ('phrase_e2', 'პოლიცია'),
    ('phrase_e3', 'მე ვარ დაკარგული'),
]

print('\n=== Phrases (43) ===')
for key, text in PHRASES:
    tts(key, text)

total_mp3 = len([f for f in os.listdir(OUT) if f.endswith('.mp3')])
total_kb  = sum(os.path.getsize(os.path.join(OUT, f))
                for f in os.listdir(OUT) if f.endswith('.mp3')) // 1024
print(f'\nDone! {total_mp3} files  ~{total_kb}KB')
print('Now run: git add audio/ && git commit -m "audio: ElevenLabs Georgian TTS" && git push')
