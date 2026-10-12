#!/usr/bin/env python3
"""Check extraction, source freshness and the browser/PDF CV without claiming universal ATS compatibility."""
from functools import partial
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import tempfile
from threading import Thread
from playwright.sync_api import expect, sync_playwright
from pypdf import PdfReader
from pypdf.generic import ContentStream

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "assets/cv/CV_Samy_Houchat.pdf"
INKS = {(0.0, 0.0, 0.0), (0.1176, 0.251, 0.6863), (1.0, 1.0, 1.0)}
HEADINGS = ["Profil", "Formation", "Expérience professionnelle", "Projet personnel", "Compétences techniques", "Langues"]
normalise = lambda text: " ".join(text.split())


def inspect_pdf(path):
    reader = PdfReader(path)
    assert not reader.is_encrypted
    assert len(reader.pages) == 1, "CV must fit one A4 page without clipping text"
    page = reader.pages[0]
    assert abs(float(page.mediabox.width) - 595.28) < 2 and abs(float(page.mediabox.height) - 841.89) < 2
    assert "/StructTreeRoot" in reader.trailer["/Root"], "PDF must retain semantic tags"
    assert all("/ToUnicode" in font.get_object() for font in page["/Resources"]["/Font"].values()), "Fonts must support text extraction"
    text = normalise(page.extract_text())
    for phrase in ["Samy HOUCHAT", "10 semaines", "1er avril 2027", "07 46 15 66 57", "samyhctpro@gmail.com",
                   "hctsamyuct.github.io", "BUT Science des données", "BTS Informatique", "Major de promotion",
                   "Layer Data", "Power BI", "Python", "SQL", "ETL", "AVDA Auto", "Anglais", "B2"]:
        assert phrase in text, f"PDF extraction lost {phrase}"
    positions = [text.index(heading) for heading in HEADINGS]
    assert positions == sorted(positions), "PDF reading order must match section order"
    for phrase in ["★", "Compétences & qualités", "Pourquoi me choisir", "FacturaPro", "BRIDGE", "AGRANA", "SOGRAL", "Informatique, bases de données et systèmes"]:
        assert phrase not in text, f"Removed or confidential content reappeared: {phrase}"
    colors = set()
    for operands, operator in ContentStream(page.get_contents(), reader).operations:
        if operator in {b"rg", b"RG"}:
            colors.add(tuple(round(float(channel), 4) for channel in operands))
    assert colors <= INKS and {(0.0, 0.0, 0.0), (0.1176, 0.251, 0.6863)} <= colors, f"Unexpected ink colors: {colors}"
    links = {str(ref.get_object().get("/A", {}).get("/URI", "")) for ref in page.get("/Annots", [])}
    assert {"mailto:samyhctpro@gmail.com", "https://hctsamyuct.github.io/", "https://www.linkedin.com/in/samyhouchat"} <= links
    return text


manifest = json.loads((ROOT / "assets/cv/CV_Samy_Houchat.build.json").read_text())
assert set(manifest["sources"]) == {"templates/cv.html", "css/cv.css", "cv_samy_houchat.html"}
for name, digest in manifest["sources"].items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, "CV sources changed: regenerate the PDF"
assert hashlib.sha256(PDF.read_bytes()).hexdigest() == manifest["pdf_sha256"]
exported_text = inspect_pdf(PDF)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}"
try:
    with tempfile.TemporaryDirectory(prefix="cv-check-") as directory, sync_playwright() as p:
        options = {"args": ["--no-sandbox", "--disable-dev-shm-usage"], "env": {**os.environ, "HOME": directory}}
        if Path("/usr/bin/chromium").exists():
            options["executable_path"] = "/usr/bin/chromium"
        browser = p.chromium.launch(**options)
        for width in [390, 1280]:
            page = browser.new_page(viewport={"width": width, "height": 1000})
            assert page.goto(base + "/cv_samy_houchat.html", wait_until="networkidle").status == 200
            assert normalise(page.locator("#cv-content").inner_text()) == exported_text
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
            colors = page.locator("#cv-content").evaluate("el => [...new Set([el, ...el.querySelectorAll('*')].map(node => getComputedStyle(node).color))]")
            assert set(colors) <= {"rgb(0, 0, 0)", "rgb(30, 64, 175)"}, colors
            assert page.locator("#cv-content").evaluate("el => [...el.querySelectorAll('p, li, a, h1, h2, h3')].every(node => parseFloat(getComputedStyle(node).fontSize) >= 12)")
            bold = page.locator("#cv-content strong").all_text_contents()
            for word in ["Power BI", "Python", "SQL", "Major de promotion"]:
                assert word in bold
            page.close()
        # Check the actual portfolio dialog and its print output as well as the standalone export.
        page = browser.new_page(viewport={"width": 1280, "height": 1000})
        page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
        page.route("https://fonts.gstatic.com/**", lambda route: route.abort())
        page.goto(base + "/", wait_until="networkidle")
        page.locator("#hero-cv-view-btn").click()
        expect(page.locator("#cv-content")).to_be_visible()
        assert normalise(page.locator("#cv-content").inner_text()) == exported_text
        printed = Path(directory) / "cv-dialog.pdf"
        page.pdf(path=str(printed), prefer_css_page_size=True, tagged=True, outline=True)
        assert inspect_pdf(printed) == exported_text
        browser.close()
    print("PASS: 1 A4 page, two ink colors, live source/PDF match, readable fonts, tagged selectable text, ordered sections, keywords, contacts and links; web/dialog/mobile checked.")
finally:
    server.shutdown()
    server.server_close()
