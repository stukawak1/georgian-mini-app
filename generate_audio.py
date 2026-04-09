#!/usr/bin/env python3
"""Generate Georgian TTS audio files using espeak-ng + ffmpeg."""

import subprocess, os, sys, json

OUT = os.path.join(os.path.dirname(__file__), 'audio')
os.makedirs(OUT, exist_ok=True)

ESPEAK = 'espeak-ng'
FFMPEG = 'ffmpeg'
SPEED = '115'   # words per minute — slightly slow for learning
PITCH = '50'

def gen(filename, text):
    wav = f'/tmp/_ka_{filename}.wav'
    mp3 = os.path.join(OUT, f'{filename}.mp3')
    if os.path.exists(mp3):
        print(f'  skip {filename}.mp3')
        return
    r = subprocess.run([ESPEAK, '-v', 'ka', '-s', SPEED, '-p', PITCH, '-w', wav, text],
                       capture_output=True)
    if r.returncode != 0:
        print(f'  ERROR espeak: {r.stderr.decode()}')
        return
    r2 = subprocess.run([FFMPEG, '-y', '-i', wav, '-codec:a', 'libmp3lame',
                         '-qscale:a', '4', '-ar', '22050', mp3],
                        capture_output=True)
    if r2.returncode != 0:
        print(f'  ERROR ffmpeg: {r2.stderr.decode()[-200:]}')
        return
    size = os.path.getsize(mp3)
    print(f'  OK {filename}.mp3  ({size//1024}KB)')

# ── ALPHABET ── 33 letters
LETTERS = [
    'ა','ბ','გ','დ','ე','ვ','ზ','თ','ი','კ','ლ','მ','ნ','ო','პ',
    'ჟ','რ','ს','ტ','უ','ფ','ქ','ღ','ყ','შ','ჩ','ც','ძ','წ','ჭ','ხ','ჯ','ჰ',
]

print('=== Letters ===')
for i, letter in enumerate(LETTERS):
    gen(f'letter_{i}', letter)

# ── FLASHCARD WORDS ──
WORDS = [
    (0,  'სახლი'),   (1,  'ქუჩა'),    (2,  'ქალაქი'),  (3,  'მთა'),
    (4,  'ზღვა'),    (5,  'მდინარე'), (6,  'ტყე'),     (7,  'ცა'),
    (8,  'მზე'),     (9,  'წყალი'),   (10, 'პური'),    (11, 'ყავა'),
    (12, 'ღვინო'),   (13, 'ხინკალი'), (14, 'ხაჭაპური'),(15, 'ხილი'),
    (16, 'ბოსტნეული'),(17,'დედა'),    (18, 'მამა'),    (19, 'და'),
    (20, 'ძმა'),     (21, 'მეგობარი'),(22, 'კაცი'),    (23, 'ქალი'),
    (24, 'ბავშვი'),  (25, 'ერთი'),    (26, 'ორი'),     (27, 'სამი'),
    (28, 'ოთხი'),    (29, 'ხუთი'),    (30, 'ექვსი'),   (31, 'შვიდი'),
    (32, 'რვა'),     (33, 'ცხრა'),    (34, 'ათი'),     (35, 'კარგი'),
    (36, 'ცუდი'),    (37, 'დიდი'),    (38, 'პატარა'),  (39, 'ლამაზი'),
    (40, 'ახალი'),   (41, 'ძველი'),   (42, 'ცხელი'),   (43, 'ცივი'),
]

print('\n=== Flashcard words ===')
for idx, word in WORDS:
    gen(f'word_{idx}', word)

# ── PHRASES ──
PHRASES = [
    # greeting
    ('phrase_g0', 'გამარჯობა'),
    ('phrase_g1', 'გამარჯობათ'),
    ('phrase_g2', 'სალამი'),
    ('phrase_g3', 'ნახვამდის'),
    ('phrase_g4', 'კარგად იყავი'),
    ('phrase_g5', 'როგორ ხარ'),
    ('phrase_g6', 'კარგად გმადლობ'),
    # polite
    ('phrase_p0', 'გმადლობ'),
    ('phrase_p1', 'გმადლობთ'),
    ('phrase_p2', 'დიდი მადლობა'),
    ('phrase_p3', 'ბოდიში'),
    ('phrase_p4', 'კი'),
    ('phrase_p5', 'არა'),
    ('phrase_p6', 'გთხოვთ'),
    ('phrase_p7', 'არაფერს'),
    # food
    ('phrase_f0', 'ხინკალი'),
    ('phrase_f1', 'ხაჭაპური'),
    ('phrase_f2', 'ღვინო'),
    ('phrase_f3', 'წყალი'),
    ('phrase_f4', 'ყავა'),
    ('phrase_f5', 'ჩაი'),
    ('phrase_f6', 'პური'),
    ('phrase_f7', 'ანგარიში გთხოვთ'),
    ('phrase_f8', 'გემრიელია'),
    ('phrase_f9', 'გაუმარჯოს'),
    # navigation
    ('phrase_n0', 'სად არის'),
    ('phrase_n1', 'მარცხნივ'),
    ('phrase_n2', 'მარჯვნივ'),
    ('phrase_n3', 'პირდაპირ'),
    ('phrase_n4', 'ახლოს'),
    ('phrase_n5', 'შორს'),
    ('phrase_n6', 'მეტრო'),
    ('phrase_n7', 'ავტობუსი'),
    ('phrase_n8', 'ტაქსი'),
    ('phrase_n9', 'სასტუმრო'),
    # shopping
    ('phrase_s0', 'რამდენი ღირს'),
    ('phrase_s1', 'ძვირია'),
    ('phrase_s2', 'იაფია'),
    ('phrase_s3', 'მინდა'),
    # emergency
    ('phrase_e0', 'დამეხმარეთ'),
    ('phrase_e1', 'ექიმი'),
    ('phrase_e2', 'პოლიცია'),
    ('phrase_e3', 'მე ვარ დაკარგული'),
]

print('\n=== Phrases ===')
for key, text in PHRASES:
    gen(key, text)

# Write manifest for JS
manifest = {}
for i in range(len(LETTERS)):
    manifest[f'letter_{i}'] = f'audio/letter_{i}.mp3'
for idx, _ in WORDS:
    manifest[f'word_{idx}'] = f'audio/word_{idx}.mp3'
for key, _ in PHRASES:
    manifest[key] = f'audio/{key}.mp3'

manifest_path = os.path.join(os.path.dirname(__file__), 'audio', 'manifest.json')
with open(manifest_path, 'w') as f:
    json.dump(manifest, f, indent=2)

total = len(os.listdir(OUT)) - 1  # minus manifest.json
print(f'\nDone! {total} audio files generated in ./audio/')
print(f'Total size: {sum(os.path.getsize(os.path.join(OUT,f)) for f in os.listdir(OUT) if f.endswith(".mp3")) // 1024}KB')
