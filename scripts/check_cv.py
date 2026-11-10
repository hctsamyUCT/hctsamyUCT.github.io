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
PDF_EN = ROOT / "assets/cv/CV_Samy_Houchat_EN.pdf"
INKS = {
    (0.0, 0.0, 0.0),
    (0.0667, 0.0941, 0.1529),
    (0.1216, 0.1608, 0.2157),
    (0.2157, 0.2549, 0.3176),
    (0.2941, 0.3333, 0.3882),
    (0.1176, 0.2275, 0.5412),
    (0.1137, 0.3059, 0.8471),
    (0.1176, 0.251, 0.6863),
    (1.0, 1.0, 1.0),
}
HEADINGS_FR = ["Profil", "Formation", "Expérience professionnelle", "Projets Data & Informatique", "Compétences techniques", "Langues"]
HEADINGS_EN = ["Profile", "Education", "Professional Experience", "Data & IT Projects", "Technical Skills", "Languages"]
normalise = lambda text: " ".join(text.split())


def inspect_pdf(path, lang="fr"):
    reader = PdfReader(path)
    assert not reader.is_encrypted
    assert len(reader.pages) == 1, f"{lang} CV must fit one A4 page without clipping text"
    page = reader.pages[0]
    assert abs(float(page.mediabox.width) - 595.28) < 2 and abs(float(page.mediabox.height) - 841.89) < 2
    assert "/StructTreeRoot" in reader.trailer["/Root"], f"{lang} PDF must retain semantic tags"
    assert all("/ToUnicode" in font.get_object() for font in page["/Resources"]["/Font"].values()), f"{lang} fonts must support text extraction"
    text = normalise(page.extract_text())

    if lang == "fr":
        headings = HEADINGS_FR
        phrases = ["Samy HOUCHAT", "10 à 12 semaines", "avril 2027", "+33 7 46 15 66 57", "samyhctpro@gmail.com",
                   "25 ans", "Permis B", "BUT Science des données (SD)", "Parcours Exploration et Modélisation Statistique",
                   "Formation en cours", "BTS Informatique", "option Bases de données", "Major de promotion",
                   "Layer Data", "client agroalimentaire", "Python", "SQL", "Langage R (RStudio)", "ETL",
                   "KPI", "data visualisation", "DAX", "Power Query", "OTIF", "SAÉ BUT SD", "AVDA Auto", "Anglais", "B2"]
        date_phrases = ["BUT Science des données (SD) — 2e année (BUT 2) — IUT Clermont Auvergne, Aurillac Depuis 09/2026",
                        "BTS Informatique — option Bases de données — Institut International de Management, Béjaïa (Major de promotion) 10/2022 – 01/2026",
                        "Baccalauréat Mathématiques — Béjaïa, Algérie 2021",
                        "Analyste de données & BI — Layer Data · when humans meet Data (Akbou, Algérie) 02/2026 – 08/2026",
                        "Technicien informatique et gérant — Cyber Café Khatri Khelaf (El Kseur, Algérie) 09/2025 – 02/2026",
                        "Power BI Sales & Supply Chain Analytics 2026 – 2027",
                        "Analyse statistique & prévision de séries temporelles — SAÉ BUT SD 2026 – 2027",
                        "AVDA Auto — Application de gestion automobile 2026"]
    else:
        headings = HEADINGS_EN
        phrases = ["Samy HOUCHAT", "10 to 12 weeks", "April 2027", "+33 7 46 15 66 57", "samyhctpro@gmail.com",
                   "25 years old", "Category B licence", "BUT in Data Science (SD)", "Statistical Exploration and Modelling track",
                   "Currently in progress", "BTS in IT", "Database option", "Top of the graduating class",
                   "Layer Data", "food industry client", "Python", "SQL", "R language (RStudio)", "ETL",
                   "KPIs", "data visualisation", "DAX", "Power Query", "OTIF", "BUT SD SAÉ", "AVDA Auto", "English", "B2"]
        date_phrases = ["BUT in Data Science (SD) — 2nd year (BUT 2) — IUT Clermont Auvergne, Aurillac Since 09/2026",
                        "BTS in IT — Database option — Institut International de Management, Béjaïa (Top of the graduating class) 10/2022 – 01/2026",
                        "High School Diploma (Baccalauréat) — Mathematics track — Béjaïa, Algeria 2021",
                        "Data Analyst & BI — Layer Data · when humans meet Data (Akbou, Algeria) 02/2026 – 08/2026",
                        "IT Technician and Manager — Cyber Café Khatri Khelaf (El Kseur, Algeria) 09/2025 – 02/2026",
                        "Power BI Sales & Supply Chain Analytics 2026 – 2027",
                        "Statistical Analysis & Time Series Forecasting — BUT SD SAÉ 2026 – 2027",
                        "AVDA Auto — Dealership Management Application 2026"]

    for phrase in phrases:
        assert phrase in text, f"{lang} PDF extraction lost {phrase}"
    positions = [text.index(heading) for heading in headings]
    assert positions == sorted(positions), f"{lang} PDF reading order must match section order"
    for phrase in date_phrases:
        assert phrase in text, f"{lang} entry header must contain title and date: {phrase}"
    for phrase in ["★", "Compétences & qualités", "Pourquoi me choisir", "FacturaPro", "BRIDGE", "AGRANA", "SOGRAL", "Informatique, bases de données et systèmes"]:
        assert phrase not in text, f"Removed or confidential content reappeared: {phrase}"
    colors = set()
    for operands, operator in ContentStream(page.get_contents(), reader).operations:
        if operator in {b"rg", b"RG"}:
            colors.add(tuple(round(float(channel), 4) for channel in operands))
    assert colors <= INKS and {(0.0, 0.0, 0.0), (0.1176, 0.251, 0.6863)} <= colors, f"Unexpected ink colors: {colors}"
    assert len(page.images) >= 1, f"Portrait missing from {lang} PDF"
    assert "hctsamyuct.github.io" in text, "Written portfolio URL must accompany the QR code for ATS"
    links = {str(ref.get_object().get("/A", {}).get("/URI", "")) for ref in page.get("/Annots", [])}
    expected_portfolio_link = "https://hctsamyuct.github.io/en/" if lang == "en" else "https://hctsamyuct.github.io/"
    assert {"mailto:samyhctpro@gmail.com", expected_portfolio_link, "https://www.linkedin.com/in/samyhouchat"} <= links
    return text


manifest = json.loads((ROOT / "assets/cv/CV_Samy_Houchat.build.json").read_text(encoding="utf-8"))
assert set(manifest["sources"]) == {"templates/cv.html", "templates/cv-en.html", "css/cv.css",
                                   "cv_samy_houchat.html", "cv_samy_houchat_en.html",
                                   "assets/img/photo_opt.jpg", "assets/img/qr-portfolio-cv.svg"}
for name, digest in manifest["sources"].items():
    data = (ROOT / name).read_bytes()
    if name.endswith((".html", ".css", ".svg")):
        data = data.replace(b"\r\n", b"\n")
    assert hashlib.sha256(data).hexdigest() == digest, f"CV source changed: regenerate the PDF ({name})"
assert hashlib.sha256(PDF.read_bytes()).hexdigest() == manifest["pdf_sha256"]
assert hashlib.sha256(PDF_EN.read_bytes()).hexdigest() == manifest["pdf_en_sha256"]
exported_text_fr = inspect_pdf(PDF, "fr")
exported_text_en = inspect_pdf(PDF_EN, "en")


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

        for lang, path, exp_text, pdf_file, pdf_name in [
            ("fr", "/cv_samy_houchat.html", exported_text_fr, PDF, "CV_Samy_Houchat_Stage_Data_Analyst_BI.pdf"),
            ("en", "/cv_samy_houchat_en.html", exported_text_en, PDF_EN, "CV_Samy_Houchat_Internship_Data_Analyst_BI.pdf")
        ]:
            for width in [390, 1280]:
                page = browser.new_page(viewport={"width": width, "height": 1000})
                assert page.goto(base + path, wait_until="networkidle").status == 200
                assert normalise(page.locator("#cv-content").inner_text()) == exp_text
                assert page.locator(".cv-photo").is_visible()
                assert page.locator(".item-header").evaluate_all("nodes => nodes.every(node => node.querySelector('.item-title') && node.querySelector('.item-date'))"), "Each entry must have a title and a date"
                assert any("Layer Data" in text for text in page.locator(".item-subtitle").all_inner_texts()), "Company name must be visible"
                assert page.locator(".cv-qr img").is_visible()
                expected_qr_url = "https://hctsamyuct.github.io/en/" if lang == "en" else "https://hctsamyuct.github.io/"
                assert page.locator(".cv-qr").get_attribute("href") == expected_qr_url
                for image in page.locator("#cv-content img").all():
                    assert image.evaluate("el => el.complete && el.naturalWidth > 0"), "CV image not loaded"
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                colors = page.locator("#cv-content").evaluate("el => [...new Set([el, ...el.querySelectorAll('*')].map(node => getComputedStyle(node).color))]")
                dom_colors = {
                    "rgb(0, 0, 0)",
                    "rgb(30, 64, 175)",
                    "rgb(17, 24, 39)",
                    "rgb(75, 85, 99)",
                    "rgb(29, 78, 216)",
                    "rgb(55, 65, 81)",
                    "rgb(30, 58, 138)",
                    "rgb(31, 41, 55)",
                }
                assert set(colors) <= dom_colors, colors
                assert page.locator("#cv-content").evaluate("el => [...el.querySelectorAll('p, li, a, h1, h2, h3, .item-title, .item-subtitle, .item-meta, .skill-category, .skill-list')].every(node => parseFloat(getComputedStyle(node).fontSize) >= 12)")
                bold = page.locator("#cv-content strong").all_text_contents()
                for word in ["Power BI", "Python", "SQL"]:
                    assert any(word in b for b in bold), f"Missing bold keyword: {word}"
                download = page.locator("#cv-download-pdf").get_attribute("href")
                assert page.locator("#cv-download-pdf").get_attribute("download") == pdf_name
                response = page.request.get(base + download)
                assert response.status == 200 and response.body() == pdf_file.read_bytes()
                settings = [
                    ("default", {}),
                    ("15mm", {"margin": {side: "15mm" for side in ["top", "bottom", "left", "right"]}}),
                    ("20mm", {"margin": {side: "20mm" for side in ["top", "bottom", "left", "right"]}}),
                    ("browser-headers", {"display_header_footer": True,
                                         "margin": {side: "15mm" for side in ["top", "bottom", "left", "right"]}}),
                ]
                for label, opt in settings:
                    printed = Path(directory) / f"cv-{lang}-{width}-{label}.pdf"
                    page.pdf(path=str(printed), format="A4", prefer_css_page_size=False, scale=1, tagged=True, **opt)
                    reader = PdfReader(printed)
                    assert len(reader.pages) == 1, f"A4 print spills to {len(reader.pages)} pages: {lang} / {width}px / {label}"
                    assert exp_text in normalise(reader.pages[0].extract_text()), f"A4 print lost text: {lang} / {label}"
                page.close()

        # Check the actual portfolio dialogs (FR and EN) and their print output
        for lang, path, exp_text in [("fr", "/", exported_text_fr), ("en", "/en/", exported_text_en)]:
            page = browser.new_page(viewport={"width": 1280, "height": 1000})
            page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
            page.route("https://fonts.gstatic.com/**", lambda route: route.abort())
            page.goto(base + path, wait_until="networkidle")
            page.locator("#hero-cv-view-btn").click()
            expect(page.locator("#cv-content")).to_be_visible()
            assert normalise(page.locator("#cv-content").inner_text()) == exp_text
            printed = Path(directory) / f"cv-dialog-{lang}.pdf"
            page.pdf(path=str(printed), prefer_css_page_size=True, tagged=True, outline=True)
            assert inspect_pdf(printed, lang) == exp_text
            page.close()

        browser.close()
    print("PASS: 1 A4 page in both downloadable PDFs (FR/EN) and 16 browser print scenarios; two ink colors, source/PDF match, readable fonts, searchable text, images, ordered sections, contacts and links; web/dialog/mobile checked.")
finally:
    server.shutdown()
    server.server_close()
