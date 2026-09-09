#!/usr/bin/env python3
"""Import posts, pages, and media from the WordPress site into this Astro site.

The script reads the public WordPress REST API at www.civitaslearning.com and
writes Markdown files into src/content. It keeps every old URL path, the title
tag, the meta description, the noindex flag, and the images with their alt text.

Requirements: beautifulsoup4, lxml, markdownify.

Run:
    python scripts/import-wp.py [--cache DIR] [--no-media]

Output:
    src/content/blog/<slug>.md        Blog posts, path /blog/<slug>/
    src/content/podcast/<slug>.md     Podcast episodes, path /podcast/<slug>/
    src/content/stories/<slug>.md     Customer stories that this site does not
                                      have yet, path /customer-success-stories/<slug>/
    src/content/news/<slug>.md        Press posts hosted on the site, path /press/<slug>/
    src/content/pages/<id>.md         Pages this site does not have yet, at their old path
    public/assets/wp/...              Images and documents referenced by the content
    scripts/wp-import-report.json     Summary of what was written and skipped
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import pathlib
import re
import sys
import urllib.parse
import urllib.request

from bs4 import BeautifulSoup, NavigableString
from markdownify import MarkdownConverter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://www.civitaslearning.com"
API = SITE + "/wp-json/wp/v2/"
UA = {"User-Agent": "Mozilla/5.0 (site migration script)"}
MAX_IMAGE_WIDTH = 1200
POST_FIELDS = "id,slug,date,modified,link,title,excerpt,content,categories,tags,author,featured_media,yoast_head_json"
PAGE_FIELDS = "id,slug,date,modified,link,title,content,parent,yoast_head_json"

CONTENT = ROOT / "src" / "content"
ASSETS = ROOT / "public" / "assets" / "wp"

# Pages on the old site that are empty or are tooling, not content.
SKIP_PAGES = {"/events-qr-code/", "/thank-you/"}

args = None
cache_dir: pathlib.Path | None = None
report = {"written": {}, "skipped": [], "media": 0, "media_bytes": 0, "warnings": []}


# --------------------------------------------------------------------------- fetch

def fetch(url: str, binary: bool = False) -> bytes:
    key = hashlib.sha1(url.encode()).hexdigest()
    if cache_dir:
        cached = cache_dir / key
        if cached.exists():
            return cached.read_bytes()
    req = urllib.request.Request(urllib.parse.quote(url, safe=":/?&=%+"), headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    if cache_dir:
        cache_dir.mkdir(parents=True, exist_ok=True)
        (cache_dir / key).write_bytes(data)
    return data


def get_json(url: str):
    return json.loads(fetch(url).decode("utf-8"))


def get_all(kind: str, fields: str) -> list:
    out = []
    page = 1
    while True:
        url = f"{API}{kind}?per_page=100&page={page}&_fields={fields}"
        batch = get_json(url)
        if not isinstance(batch, list) or not batch:
            break
        out.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return out


# --------------------------------------------------------------------------- helpers

def text_of(fragment: str) -> str:
    return re.sub(r"\s+", " ", BeautifulSoup(fragment or "", "lxml").get_text(" ")).strip()


def yaml_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def frontmatter(fields: dict) -> str:
    lines = ["---"]
    for k, v in fields.items():
        if v is None:
            continue
        if isinstance(v, bool):
            lines.append(f"{k}: {'true' if v else 'false'}")
        elif isinstance(v, (int, float)):
            lines.append(f"{k}: {v}")
        elif isinstance(v, list):
            if not v:
                lines.append(f"{k}: []")
            else:
                lines.append(f"{k}:")
                for item in v:
                    if isinstance(item, dict):
                        first = True
                        for ik, iv in item.items():
                            prefix = "- " if first else "  "
                            lines.append(f"{prefix}{ik}: {yaml_str(str(iv))}")
                            first = False
                    else:
                        lines.append(f"- {yaml_str(str(item))}")
        elif isinstance(v, dict):
            lines.append(f"{k}:")
            for ik, iv in v.items():
                lines.append(f"  {ik}: {yaml_str(str(iv))}")
        else:
            lines.append(f"{k}: {yaml_str(str(v))}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def normalize(link: str) -> str:
    """Bring every spelling of the old site's origin to SITE."""
    return re.sub(r"^https?://(www\.)?civitaslearning\.com(?=/|$)", SITE, link.strip())


def site_path(link: str) -> str:
    link = normalize(link)
    if not link.startswith(SITE):
        return link
    p = link[len(SITE):]
    p = p.split("#")[0].split("?")[0]
    if not p.startswith("/"):
        p = "/" + p
    if not p.endswith("/") and "." not in p.rsplit("/", 1)[-1]:
        p += "/"
    return p or "/"


def local_routes() -> set[str]:
    """Paths this site already builds from its own templates and data."""
    routes = set()
    pages = ROOT / "src" / "pages"
    for f in pages.rglob("*.astro"):
        rel = f.relative_to(pages).with_suffix("")
        parts = list(rel.parts)
        if any(p.startswith("[") for p in parts):
            continue
        if parts[-1] == "index":
            parts = parts[:-1]
        routes.add("/" + "/".join(parts) + "/" if parts else "/")
    solutions = json.loads((ROOT / "src" / "data" / "solutions.json").read_text())
    for s in solutions:
        routes.add(f"/{s['slug']}/")
    return routes


# --------------------------------------------------------------------------- media

def pick_from_srcset(srcset: str, fallback: str) -> str:
    best = None
    for part in srcset.split(","):
        bits = part.strip().split()
        if len(bits) != 2 or not bits[1].endswith("w"):
            continue
        try:
            w = int(bits[1][:-1])
        except ValueError:
            continue
        if w <= MAX_IMAGE_WIDTH and (best is None or w > best[0]):
            best = (w, bits[0])
    return best[1] if best else fallback


def download_asset(url: str) -> str | None:
    """Download a file from wp-content/uploads. Return the local path under /assets/wp/."""
    if args.no_media:
        return url
    clean = url.split("?")[0]
    m = re.search(r"/wp-content/uploads/(.+)$", clean)
    if not m:
        return None
    rel = urllib.parse.unquote(m.group(1))
    dest = ASSETS / rel
    if not dest.exists():
        try:
            data = fetch(clean, binary=True)
        except Exception as e:  # noqa: BLE001
            report["warnings"].append(f"media download failed: {clean} ({e})")
            return None
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        report["media"] += 1
        report["media_bytes"] += len(data)
    return "/assets/wp/" + rel


def featured_image(post: dict, media_cache: dict) -> tuple[str | None, str]:
    mid = post.get("featured_media") or 0
    if mid:
        if mid not in media_cache:
            try:
                media_cache[mid] = get_json(f"{API}media/{mid}?_fields=source_url,alt_text,media_details")
            except Exception:  # noqa: BLE001
                media_cache[mid] = {}
        m = media_cache[mid]
        if m:
            sizes = (m.get("media_details") or {}).get("sizes") or {}
            url = None
            for name in ("large", "medium_large", "full"):
                if name in sizes and sizes[name].get("source_url"):
                    url = sizes[name]["source_url"]
                    break
            url = url or m.get("source_url")
            if url:
                local = download_asset(url)
                if local:
                    return local, m.get("alt_text") or ""
    og = ((post.get("yoast_head_json") or {}).get("og_image") or [{}])[0].get("url")
    if og:
        local = download_asset(og)
        if local:
            return local, ""
    return None, ""


# --------------------------------------------------------------------------- html -> markdown

class Converter(MarkdownConverter):
    def convert_span(self, el, text, parent_tags=None, **kw):
        return text

    def convert_div(self, el, text, parent_tags=None, **kw):
        return text

    def convert_figure(self, el, text, parent_tags=None, **kw):
        return "\n\n" + text.strip() + "\n\n"

    def convert_figcaption(self, el, text, parent_tags=None, **kw):
        t = text.strip()
        return f"\n\n*{t}*\n\n" if t else ""


def embed_html(iframe) -> str:
    src = iframe.get("src") or iframe.get("data-src") or ""
    title = html.escape(iframe.get("title") or "Embedded content", quote=True)
    src_esc = html.escape(src, quote=True)
    if "libsyn.com" in src or "spotify.com" in src or "apple.com" in src:
        return f'<div class="embed audio"><iframe src="{src_esc}" title="{title}" loading="lazy"></iframe></div>'
    if "youtube" in src or "youtu.be" in src or "vimeo" in src or "wistia" in src:
        return (
            f'<div class="embed video"><iframe src="{src_esc}" title="{title}" loading="lazy" '
            f'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
        )
    return f'<div class="embed"><iframe src="{src_esc}" title="{title}" loading="lazy"></iframe></div>'


def html_to_markdown(fragment: str) -> str:
    soup = BeautifulSoup(f"<div>{fragment}</div>", "lxml")
    for tag in soup.find_all(["script", "style", "form", "noscript", "input", "button", "select", "textarea"]):
        tag.decompose()
    for tag in soup.find_all(class_=re.compile(r"hs-form|hbspt|x-modal|x-dropdown|sharedaddy")):
        tag.decompose()

    embeds = []
    for iframe in soup.find_all("iframe"):
        embeds.append(embed_html(iframe))
        token = soup.new_tag("p")
        token.string = f"@@EMBED{len(embeds) - 1}@@"
        iframe.replace_with(token)

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        srcset = img.get("srcset") or img.get("data-srcset") or ""
        if srcset:
            src = pick_from_srcset(srcset, src)
        if src.startswith("//"):
            src = "https:" + src
        if src.startswith("/"):
            src = SITE + src
        local = download_asset(src) if "/wp-content/uploads/" in src else None
        if local is None and "/wp-content/uploads/" in src:
            img.decompose()
            continue
        img.attrs = {"src": local or src, "alt": img.get("alt") or ""}

    for a in soup.find_all("a"):
        href = a.get("href") or ""
        if href.startswith("//"):
            href = "https:" + href
        href = normalize(href)
        if "/wp-content/uploads/" in href:
            if href.startswith("/"):
                href = SITE + href
            local = download_asset(href)
            if local:
                href = local
        elif href.startswith(SITE):
            href = site_path(href)
        a["href"] = href
        for attr in ("target", "rel", "class", "style", "data-wpel-link"):
            a.attrs.pop(attr, None)

    md = Converter(heading_style="ATX", bullets="-", escape_asterisks=False, escape_underscores=False).convert_soup(soup)
    md = html.unescape(md) if "&" in md and "&amp;" not in md else md
    md = re.sub(r"[ \t]+\n", "\n", md)
    md = re.sub(r"\n{3,}", "\n\n", md).strip() + "\n"
    for i, e in enumerate(embeds):
        md = md.replace(f"@@EMBED{i}@@", e)
    return md


# --------------------------------------------------------------------------- heuristics

VERBS = r"(?:Sees|Moves|Boosts|Uses|Leverages|Improves|Increases|Achieves|Builds|Amplifies|Lifts|Transforms|Turns|Reduces|Raises|Reaches|Partners|Adopts|Drives|Creates|Grows|Expands|Removes|Closes|Delivers|Empowers|Streamlines|Unifies|Improved|Increased|Achieved|Raised)"


# Stories whose title does not name the institution in a way the heuristic finds.
INSTITUTION_BY_SLUG = {
    "snow-college": "Snow College",
    "3-ways-lorain-county-community-college-uses-actionable-analytics-to-reach-its-persistence-and-completion-goals": "Lorain County Community College",
    "how-utsa-sustained-enrollment-with-data-activated-retention-strategies": "UTSA",
    "early-lift-in-persistence-after-adopting-integrated-academic-planning-and-scheduling": "Northwest Missouri State University",
}


def guess_institution(title: str, slug: str = "") -> str:
    if slug in INSTITUTION_BY_SLUG:
        return INSTITUTION_BY_SLUG[slug]
    t = re.sub(r"\s+", " ", html.unescape(title)).strip()
    t = re.sub(r"\s+with\b.*$", "", t)
    m = re.search(r"\bat (?:the )?([A-Z][A-Za-z&.'’\- ]+?)(?:[:,]| –| —|$)", t)
    if m:
        return m.group(1).strip()
    m = re.search(r"^(?:How )?([A-Z][A-Za-z&.\- ]+?)(?:'s|’s)\b", t)
    if m and len(m.group(1).split()) <= 6:
        return m.group(1).strip()
    m = re.search(r"^(?:How )?([A-Z][A-Za-z&.\- ]+?) " + VERBS + r"\b", t)
    if m and len(m.group(1).split()) <= 6:
        return m.group(1).strip()
    return ""


def guess_guest(title: str) -> str:
    t = html.unescape(title)
    m = re.search(r"\bwith ((?:Dr\.? )?[A-Z][A-Za-z.'’\-]+(?: [A-Z][A-Za-z.'’\-]+){1,3})\s*$", t)
    return m.group(1).strip() if m else ""


def read_existing_frontmatter(path: pathlib.Path) -> dict:
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---", text, re.S)
    if not m:
        return {}
    out = {}
    for line in m.group(1).splitlines():
        mm = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if mm:
            v = mm.group(2).strip()
            if v.startswith(("'", '"')) and v.endswith(("'", '"')):
                v = v[1:-1]
            out[mm.group(1)] = v
    return out


# --------------------------------------------------------------------------- main

def write(path: pathlib.Path, fm: dict, body: str, bucket: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(frontmatter(fm) + "\n" + body, encoding="utf-8")
    report["written"].setdefault(bucket, []).append(path.relative_to(ROOT).as_posix())


def main():
    global args, cache_dir
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", help="directory for cached API and media responses")
    ap.add_argument("--no-media", action="store_true", help="do not download images; keep remote URLs")
    args = ap.parse_args()
    cache_dir = pathlib.Path(args.cache) if args.cache else None

    users = {u["id"]: u["name"] for u in get_all("users", "id,name")}
    cats = {c["id"]: c["slug"] for c in get_all("categories", "id,slug")}
    tags = {t["id"]: t["name"] for t in get_all("tags", "id,name")}
    posts = get_all("posts", POST_FIELDS)
    pages = get_all("pages", PAGE_FIELDS)
    media_cache: dict = {}
    print(f"posts {len(posts)}  pages {len(pages)}", file=sys.stderr)

    story_order = 100
    podcast_order = 1000

    for post in sorted(posts, key=lambda p: p["date"], reverse=True):
        slugs = {cats.get(c, "") for c in post["categories"]}
        yo = post.get("yoast_head_json") or {}
        link = post["link"]
        path = site_path(link)
        title = html.unescape(text_of(post["title"]["rendered"]))
        description = (yo.get("description") or text_of(post["excerpt"]["rendered"])).strip()
        robots = yo.get("robots") or {}
        noindex = "noindex" in (robots.get("index") or "")
        common = {
            "title": title,
            "description": description,
            "date": post["date"][:10],
            "updated": post["modified"][:10],
            "seoTitle": yo.get("title") or None,
            "noindex": True if noindex else None,
            "source": link,
        }

        if "podcast" in slugs:
            body = html_to_markdown(post["content"]["rendered"])
            image, alt = featured_image(post, media_cache)
            dest = CONTENT / "podcast" / f"{post['slug']}.md"
            old = read_existing_frontmatter(dest)
            fm = {**common,
                  "guest": old.get("guest") or guess_guest(title),
                  "order": int(old["order"]) if old.get("order", "").isdigit() else podcast_order,
                  "url": path,
                  "image": image, "imageAlt": alt or None}
            podcast_order += 1
            write(dest, fm, body, "podcast")
        elif "customer-success-stories" in slugs:
            dest = CONTENT / "stories" / f"{post['slug']}.md"
            old = read_existing_frontmatter(dest)
            # A hand-curated story has no `imported` flag. Keep it as it is.
            if dest.exists() and not old.get("imported"):
                report["skipped"].append(f"story kept as curated: {path}")
                continue
            body = html_to_markdown(post["content"]["rendered"])
            image, alt = featured_image(post, media_cache)
            fm = {"institution": guess_institution(title, post["slug"]), "type": "Customer story", "headline": title,
                  "summary": description, "outcomes": [], "solutions": [], "order": story_order,
                  "date": common["date"], "updated": common["updated"], "seoTitle": common["seoTitle"],
                  "noindex": common["noindex"], "source": link, "image": image, "imageAlt": alt or None,
                  "imported": True}
            story_order += 1
            write(CONTENT / "stories" / f"{post['slug']}.md", fm, body, "stories")
        elif "blog" in slugs:
            body = html_to_markdown(post["content"]["rendered"])
            image, alt = featured_image(post, media_cache)
            fm = {**common, "author": users.get(post["author"], "Civitas Learning"),
                  "tags": [tags[t] for t in post.get("tags", []) if t in tags],
                  "image": image, "imageAlt": alt or None}
            write(CONTENT / "blog" / f"{post['slug']}.md", fm, body, "blog")
        elif "press" in slugs and link.startswith(SITE):
            body = html_to_markdown(post["content"]["rendered"])
            image, alt = featured_image(post, media_cache)
            fm = {**common, "image": image, "imageAlt": alt or None}
            write(CONTENT / "news" / f"{post['slug']}.md", fm, body, "news")
        else:
            report["skipped"].append(f"link post ({','.join(sorted(slugs))}): {link}")

    have = local_routes()
    for page in pages:
        path = site_path(page["link"])
        if path in have or path in SKIP_PAGES:
            report["skipped"].append(f"page exists locally or is excluded: {path}")
            continue
        yo = page.get("yoast_head_json") or {}
        title = html.unescape(text_of(page["title"]["rendered"]))
        raw = page["content"]["rendered"]
        body = html_to_markdown(raw) if raw.strip() else ""
        if page["slug"] == "open-positions" and not body.strip():
            body = (
                "Civitas Learning is a fully remote team. Open roles are listed on our Greenhouse job board.\n\n"
                '<a class="btn btn-primary" href="https://boards.greenhouse.io/civitaslearning">See open positions on Greenhouse</a>\n\n'
                '<div id="grnhse_app"></div>\n'
                '<script src="https://boards.greenhouse.io/embed/job_board/js?for=civitaslearning"></script>\n'
            )
        if not body.strip():
            report["skipped"].append(f"page empty: {path}")
            continue
        robots = yo.get("robots") or {}
        fm = {"title": title, "description": yo.get("description") or "", "path": path,
              "updated": page["modified"][:10], "seoTitle": yo.get("title") or None,
              "noindex": True if "noindex" in (robots.get("index") or "") else None, "source": page["link"]}
        pid = path.strip("/").replace("/", "--")
        write(CONTENT / "pages" / f"{pid}.md", fm, body, "pages")

    (ROOT / "scripts" / "wp-import-report.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
    for k, v in report["written"].items():
        print(f"{k}: {len(v)} files", file=sys.stderr)
    print(f"media: {report['media']} files, {report['media_bytes'] / 1e6:.1f} MB", file=sys.stderr)
    print(f"skipped: {len(report['skipped'])}, warnings: {len(report['warnings'])}", file=sys.stderr)


if __name__ == "__main__":
    main()
