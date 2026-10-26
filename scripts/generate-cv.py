#!/usr/bin/env python3
"""Export the web CVs (FR and EN) as tagged, searchable A4 PDFs; fail instead of clipping pages.

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

        # 1. French CV PDF
        page_fr = browser.new_page()
        assert page_fr.goto(f"http://127.0.0.1:{server.server_port}/cv_samy_houchat.html", wait_until="networkidle").status == 200
        pdf_path_fr = Path(directory) / "cv_fr.pdf"
        page_fr.pdf(path=str(pdf_path_fr), format="A4", prefer_css_page_size=True,
                    print_background=False, tagged=True, outline=True)
        page_fr.close()

        reader_fr = PdfReader(pdf_path_fr)
        if len(reader_fr.pages) != 1:
            raise RuntimeError(f"French CV renders to {len(reader_fr.pages)} pages; adjust content/layout without clipping it.")
        text_fr = reader_fr.pages[0].extract_text()
        for keyword in ["Samy", "HOUCHAT", "avril 2027", "Formation", "Layer Data", "Power BI", "SQL", "Anglais"]:
            assert keyword in text_fr, f"French PDF export lost text: {keyword}"
        target_fr = ROOT / "assets/cv/CV_Samy_Houchat.pdf"
        target_fr.write_bytes(pdf_path_fr.read_bytes())
        (ROOT / "assets/cv/CV_Samy_Houchat_Stage_Data_Analyst_BI.pdf").write_bytes(pdf_path_fr.read_bytes())

        # 2. English CV PDF
        page_en = browser.new_page()
        assert page_en.goto(f"http://127.0.0.1:{server.server_port}/cv_samy_houchat_en.html", wait_until="networkidle").status == 200
        pdf_path_en = Path(directory) / "cv_en.pdf"
        page_en.pdf(path=str(pdf_path_en), format="A4", prefer_css_page_size=True,
                    print_background=False, tagged=True, outline=True)
        page_en.close()

        reader_en = PdfReader(pdf_path_en)
        if len(reader_en.pages) != 1:
            raise RuntimeError(f"English CV renders to {len(reader_en.pages)} pages; adjust content/layout without clipping it.")
        text_en = reader_en.pages[0].extract_text()
        for keyword in ["Samy", "HOUCHAT", "April 2027", "Education", "Layer Data", "Power BI", "SQL", "English"]:
            assert keyword in text_en, f"English PDF export lost text: {keyword}"
        target_en = ROOT / "assets/cv/CV_Samy_Houchat_EN.pdf"
        target_en.write_bytes(pdf_path_en.read_bytes())
        (ROOT / "assets/cv/CV_Samy_Houchat_Internship_Data_Analyst_BI.pdf").write_bytes(pdf_path_en.read_bytes())

        browser.close()

        sources = ["templates/cv.html", "templates/cv-en.html", "css/cv.css",
                   "cv_samy_houchat.html", "cv_samy_houchat_en.html",
                   "assets/img/photo_opt.jpg", "assets/img/qr-portfolio-cv.svg", "assets/img/layer_data_logo_opt.png"]

        def get_source_bytes(name):
            data = (ROOT / name).read_bytes()
            if name.endswith((".html", ".css", ".svg")):
                data = data.replace(b"\r\n", b"\n")
            return data

        manifest = {
            "sources": {name: hashlib.sha256(get_source_bytes(name)).hexdigest() for name in sources},
            "pdf_sha256": hashlib.sha256(target_fr.read_bytes()).hexdigest(),
            "pdf_en_sha256": hashlib.sha256(target_en.read_bytes()).hexdigest()
        }
        (ROOT / "assets/cv/CV_Samy_Houchat.build.json").write_text(json.dumps(manifest, indent=2) + "\n")
        print(f"PASS: exported 1 tagged A4 page for FR ({target_fr.stat().st_size} bytes) and EN ({target_en.stat().st_size} bytes).")
finally:
    server.shutdown()
    server.server_close()
