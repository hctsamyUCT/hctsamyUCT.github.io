#!/usr/bin/env python3
"""Export the web CV as a tagged, searchable A4 PDF; fail instead of clipping pages.

Requires Playwright 1.62.0, Chromium and pypdf 6.10.0.
"""
from functools import partial
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import tempfile
from threading import Thread
from playwright.sync_api import sync_playwright
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
try:
    with tempfile.TemporaryDirectory(prefix="cv-export-") as directory, sync_playwright() as p:
        options = {"args": ["--no-sandbox", "--disable-dev-shm-usage"], "env": {**os.environ, "HOME": directory}}
        if Path("/usr/bin/chromium").exists():
            options["executable_path"] = "/usr/bin/chromium"
        browser = p.chromium.launch(**options)
        page = browser.new_page()
        assert page.goto(f"http://127.0.0.1:{server.server_port}/cv_samy_houchat.html", wait_until="networkidle").status == 200
        page.pdf(path=str(Path(directory) / "cv.pdf"), format="A4", prefer_css_page_size=True,
                 print_background=False, tagged=True, outline=True)
        browser.close()
        pdf = Path(directory) / "cv.pdf"
        reader = PdfReader(pdf)
        if len(reader.pages) != 1:
            raise RuntimeError(f"CV renders to {len(reader.pages)} pages; adjust content/layout without clipping it.")
        text = reader.pages[0].extract_text()
        for keyword in ["Samy", "HOUCHAT", "1er avril 2027", "Formation", "Layer Data", "Power BI", "SQL", "Anglais"]:
            assert keyword in text, f"PDF export lost text: {keyword}"
        target = ROOT / "assets/cv/CV_Samy_Houchat.pdf"
        target.write_bytes(pdf.read_bytes())
        sources = ["templates/cv.html", "css/cv.css", "cv_samy_houchat.html"]
        manifest = {"sources": {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in sources},
                    "pdf_sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
        (ROOT / "assets/cv/CV_Samy_Houchat.build.json").write_text(json.dumps(manifest, indent=2) + "\n")
        print(f"PASS: exported 1 tagged A4 page with selectable text ({target.stat().st_size} bytes).")
finally:
    server.shutdown()
    server.server_close()
