#!/usr/bin/env python3
"""Build public/data/ipeds.json from the IPEDS data center CSV files.

The home page calculator uses this file to find an institution and fill in
its real fall undergraduate headcount, net price, first-year retention rate,
and graduation rate. Peers are computed in the browser from the same file.

Download these files from https://nces.ed.gov/ipeds/datacenter/ (Complete
data files) and unzip them into one folder:

    HD2023.zip        Institutional characteristics (directory)
    DRVEF2023.zip     Derived enrollment: headcount and retention
    EF2023D.zip       Retention cohort counts
    DRVGR2023.zip     Derived graduation rates
    SFA2223.zip       Student financial aid: net price and Pell share

Run:
    python scripts/build-ipeds.py <folder with the unzipped csv files>

Rows kept: active, degree-granting, Title IV institutions in sectors 1 to 6
(public and private, two-year and four-year) with at least 200 undergraduates.
A retention or graduation rate that IPEDS does not report is stored as null.
Retention is also stored as null when the full-time retention cohort has fewer
than MIN_COHORT students. A community college that awards a few bachelor's
degrees reports retention on that tiny bachelor's cohort, and a 100% rate from
three students is not a benchmark.

Output row shape (arrays keep the file small):
    [unitid, name, city, state, sector, undergrad headcount,
     retention %, graduation %, net price $, pell %, carnegie group]
"""
from __future__ import annotations

import csv
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "data" / "ipeds.json"
YEAR = "2023-24"
MIN_COHORT = 50


def find(folder: pathlib.Path, stem: str) -> pathlib.Path:
    hits = [p for p in folder.rglob("*.csv") if p.stem.lower() == stem.lower()]
    if not hits:
        sys.exit(f"missing {stem}.csv under {folder}")
    return hits[0]


def read(path: pathlib.Path) -> dict[str, dict]:
    # The files are UTF-8 with a byte-order mark. Decode errors are replaced,
    # and column names keep only ASCII letters, digits, and underscores.
    with path.open(encoding="utf-8-sig", errors="replace", newline="") as f:
        reader = csv.DictReader(f)
        rows = {}
        for row in reader:
            row = {"".join(ch for ch in k.upper() if ch.isascii() and (ch.isalnum() or ch == "_")): (v or "").strip() for k, v in row.items() if k}
            rows[row["UNITID"]] = row
        return rows


def num(v: str) -> float | None:
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    folder = pathlib.Path(sys.argv[1])
    hd = read(find(folder, "hd2023"))
    ef = read(find(folder, "drvef2023"))
    efd = read(find(folder, "ef2023d"))
    gr = read(find(folder, "drvgr2023"))
    sfa = read(find(folder, "sfa2223"))

    rows = []
    for uid, h in hd.items():
        try:
            sector = int(h.get("SECTOR") or 0)
        except ValueError:
            continue
        if not (1 <= sector <= 6):
            continue
        if h.get("PSET4FLG") != "1" or h.get("DEGGRANT") != "1" or h.get("CYACTIVE") != "1":
            continue
        e = ef.get(uid, {})
        ug = num(e.get("EFUG"))
        # IPEDS writes "." when a figure is not available. num() turns that into None
        # and the row is kept, so the institution can still be found.
        ret = num(e.get("RET_PCF"))
        # RRFTCTA is the adjusted full-time retention cohort. A rate from a
        # cohort smaller than MIN_COHORT is noise, not a benchmark.
        cohort = num(efd.get(uid, {}).get("RRFTCTA"))
        if cohort is None or cohort < MIN_COHORT:
            ret = None
        if not ug or ug < 200:
            continue
        g = gr.get(uid, {})
        grad = num(g.get("GBA6RTT")) if sector <= 3 else None
        if grad is None:
            grad = num(g.get("GRRTTOT"))
        s = sfa.get(uid, {})
        np_ = num(s.get("NPIST2")) if sector in (1, 4) else None
        if np_ is None:
            np_ = num(s.get("NPGRN2"))
        pell = num(s.get("UPGRNTP"))
        # Carnegie 2021 basic classification, folded into six groups so peers
        # compare like with like: an associate's college that awards a few
        # bachelor's degrees is still an associate's college.
        c = num(h.get("C21BASIC")) or 0
        if 1 <= c <= 14:
            group = 1  # associate's and special-focus two-year
        elif 15 <= c <= 17:
            group = 2  # doctoral universities
        elif 18 <= c <= 20:
            group = 3  # master's colleges and universities
        elif 21 <= c <= 23:
            group = 4  # baccalaureate colleges
        elif c >= 24:
            group = 5  # special focus four-year and tribal
        else:
            group = 0  # not classified
        rows.append([
            int(uid),
            h["INSTNM"],
            h.get("CITY", ""),
            h.get("STABBR", ""),
            sector,
            int(ug),
            round(ret) if ret is not None else None,
            round(grad) if grad is not None else None,
            round(np_) if np_ is not None else None,
            round(pell) if pell is not None else None,
            group,
        ])

    rows.sort(key=lambda r: r[1].lower())
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "year": YEAR,
        "source": "IPEDS, National Center for Education Statistics",
        "fields": ["unitid", "name", "city", "state", "sector", "undergrad", "retention", "graduation", "netPrice", "pell", "carnegieGroup"],
        "rows": rows,
    }
    OUT.write_text(json.dumps(payload, separators=(",", ":"), ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(rows)} institutions -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1e3:.0f} KB)")


if __name__ == "__main__":
    main()
