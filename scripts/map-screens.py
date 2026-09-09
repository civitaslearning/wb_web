#!/usr/bin/env python3
"""Attach live-site screenshots to sections in src/data/solutions.json.

Input: scripts/screens-inventory.json — per page, the images found on the live page in DOM
order, each with its alt text and the nearest preceding heading.
Rules, in order:
  1. image alt == section heading            → that section's image
  2. image heading == section heading        → that section's image (first free)
  3. leftover images under a heading         → the next free body section after it
  4. "For X" role sections                   → the image under the same heading
  5. bullet-only sections                    → one image per bullet if counts match, or
                                               bullet prefix ("Title: …") == image heading
  6. bullet-only sections with matching SVGs → icons
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
inv = json.load(open(ROOT / 'scripts/screens-inventory.json'))['inv']
sol = json.load(open(ROOT / 'src/data/solutions.json'))

def fname(u):
    n = u.split('/')[-1]
    return n if n.endswith('.svg') else n.rsplit('.', 1)[0] + '.webp'
def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', (s or '').lower()).strip()

for p in sol:
    items = inv.get('/' + p['slug'] + '/', [])
    secs = p['sections']
    for s in secs:
        for k in ('image', 'images', 'icons'):
            s.pop(k, None)
    body = [s for s in secs if s['body'] and not re.match(r'^for ', s['heading'], re.I)]
    rasters = [it for it in items if not fname(it['src']).endswith('.svg')]
    used = set()

    def give(s, it):
        s['image'] = {'file': fname(it['src']), 'alt': it['alt'] or s['heading']}
        used.add(fname(it['src']))

    for it in rasters:                                   # 1. alt match
        for s in body:
            if 'image' not in s and norm(it['alt']) and norm(it['alt']) == norm(s['heading']) and fname(it['src']) not in used:
                give(s, it); break
    for it in rasters:                                   # 2. heading match
        if fname(it['src']) in used: continue
        for s in body:
            if 'image' not in s and norm(s['heading']) == norm(it['h']):
                give(s, it); break
    for it in rasters:                                   # 3. spill to next free section
        if fname(it['src']) in used: continue
        idx = next((i for i, s in enumerate(body) if norm(s['heading']) == norm(it['h'])), None)
        if idx is None: continue
        for s in body[idx + 1:]:
            if 'image' not in s:
                give(s, it); break
    for s in secs:                                       # 4. roles
        if re.match(r'^for ', s['heading'], re.I):
            it = next((it for it in rasters if norm(it['h']) == norm(s['heading'])), None)
            if it: s['image'] = {'file': fname(it['src']), 'alt': s['heading']}
    for s in secs:                                       # 5. bullet image sets
        if s['bullets'] and not s['body']:
            rs = [it for it in rasters if norm(it['h']) == norm(s['heading'])]
            if rs and len(rs) == len(s['bullets']):
                s['images'] = [{'file': fname(it['src']), 'alt': it['alt'] or b.split(':')[0]} for it, b in zip(rs, s['bullets'])]
                continue
            imgs = []
            for b in s['bullets']:
                it = next((it for it in rasters if norm(it['h']) == norm(b.split(':')[0])), None)
                if not it: break
                imgs.append({'file': fname(it['src']), 'alt': b.split(':')[0]})
            if len(imgs) == len(s['bullets']):
                s['images'] = imgs
    for s in secs:                                       # 6. icons
        if s['bullets'] and not s['body'] and 'images' not in s:
            svgs = [it for it in items if fname(it['src']).endswith('.svg') and norm(it['h']) == norm(s['heading'])]
            if len(svgs) == len(s['bullets']):
                s['icons'] = [fname(it['src']) for it in svgs]

json.dump(sol, open(ROOT / 'src/data/solutions.json', 'w'), indent=1, ensure_ascii=False)
for p in sol:
    print(f"{p['slug']:40s} images {sum(1 for s in p['sections'] if 'image' in s):2d}  sets {sum(1 for s in p['sections'] if 'images' in s)}  icons {sum(1 for s in p['sections'] if 'icons' in s)}")
