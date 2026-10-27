#!/usr/bin/env python3
"""FR/EN smoke checks, including the reported clipped third screenshot selector.

Optional test dependency: playwright==1.62.0 (Chromium required).
Uses a temporary local HTTP server; no production or third-party service is called.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import tempfile
from threading import Thread
from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CONTRAST_CHECK = (ROOT / "scripts/contrast-check.js").read_text(encoding="utf-8").rstrip().removesuffix(";")


def check_contrast(page):
    result = page.evaluate(CONTRAST_CHECK)
    assert result["checked"] >= 80, "Contrast audit did not check the expected text elements"
    assert not result["failures"], result["failures"]
    if page.locator("html").get_attribute("data-theme") == "dark":
        assert page.locator("body").evaluate("el => {const rgb=getComputedStyle(el).backgroundColor.match(/[\\d.]+/g).slice(0,3).map(Number); return Math.max(...rgb)-Math.min(...rgb)<=3}"), "Dark canvas should be neutral, not blue"
    return result


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}"
try:
    with tempfile.TemporaryDirectory(prefix="portfolio-browser-") as directory, sync_playwright() as p:
        options = {"args": ["--no-sandbox", "--disable-dev-shm-usage"],
                   "env": {**os.environ, "HOME": directory}}
        if Path("/usr/bin/chromium").exists():
            options["executable_path"] = "/usr/bin/chromium"
        browser = p.chromium.launch(**options)
        checks = 0
        for language, path in [("fr", "/"), ("en", "/en/")]:
            for width, javascript in [(320, True), (390, True), (768, True), (1024, True),
                                      (1440, True), (390, False)]:
                context = browser.new_context(viewport={"width": width, "height": 900},
                                              java_script_enabled=javascript)
                context.route("https://fonts.googleapis.com/**", lambda route: route.abort())
                context.route("https://fonts.gstatic.com/**", lambda route: route.abort())
                page = context.new_page()
                errors, bad_responses = [], []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on("response", lambda response: bad_responses.append(response.url)
                        if response.url.startswith(base) and response.status >= 400 else None)
                assert page.goto(base + path, wait_until="networkidle").status == 200
                assert page.locator("html").get_attribute("lang") == language
                assert page.locator("h1").count() == 1
                assert page.locator("main .stat-card").count() == 4
                assert page.locator("main .languages-card").count() == 0
                assert page.locator(".project-card").count() == 3
                assert page.locator(".proof-tab-btn").count() == 3
                assert page.locator(".language-switch a[aria-current='page']").inner_text() == language.upper()
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), (language, width, "overflow")
                # Test both container containment and readable, untruncated labels.
                for tab in page.locator(".proof-tab-btn").all():
                    assert tab.evaluate("el => {const a=el.getBoundingClientRect(), b=el.closest('.featured-preview-column').getBoundingClientRect(); return a.left>=b.left-1 && a.right<=b.right+1}"), (language, width, "clipped tab")
                for label in page.locator(".proof-tab-title, .proof-tab-sub").all():
                    assert label.evaluate("el => el.scrollWidth <= el.clientWidth+1 && el.scrollHeight <= el.clientHeight+1"), (language, width, "clipped label")
                assert page.locator("#projets .section-title").evaluate("el => parseFloat(getComputedStyle(el).fontSize) >= 24"), "CV stylesheet overrides portfolio heading"
                check_contrast(page)
                if javascript:
                    first = page.locator(".proof-tab-btn").first
                    first.focus()
                    page.keyboard.press("End")
                    third = page.locator(".proof-tab-btn").nth(2)
                    assert third.get_attribute("aria-selected") == "true"
                    assert third.get_attribute("tabindex") == "0"
                    assert page.locator("#featured-main-img").get_attribute("src").endswith("bi-modele-donnees.png")
                    assert page.locator("#featured-preview-panel").get_attribute("aria-labelledby") == third.get_attribute("id")
                    page.locator("#featured-zoom-trigger").click()
                    assert page.locator("#lightbox-overlay").get_attribute("aria-hidden") == "false"
                    page.keyboard.press("Escape")
                    page.locator(".btn-detail-trigger").first.click()
                    assert page.locator("#project-modal-overlay").get_attribute("aria-hidden") == "false"
                    expect(page.locator("#project-modal-body")).to_be_visible()
                    check_contrast(page)
                    if language == "en":
                        details = page.locator("#project-modal-body").inner_text()
                        assert "Goal:" in details and "Key contributions" in details
                        assert "Objectif" not in details and "Réalisations" not in details
                    page.keyboard.press("Escape")
                    previous_theme = page.locator("html").get_attribute("data-theme")
                    page.locator("#theme-toggle-btn").click()
                    assert page.locator("html").get_attribute("data-theme") != previous_theme
                    page.wait_for_timeout(600)  # Wait for the theme's CSS color transitions to settle.
                    check_contrast(page)
                    page.locator("#hero-cv-view-btn").click()
                    assert page.locator("#cv-modal-overlay").get_attribute("aria-hidden") == "false"
                    expect(page.locator("#cv-content")).to_be_visible()
                    if language == "en":
                        assert "Profile" in page.locator("#cv-content").inner_text()
                    else:
                        assert "Profil" in page.locator("#cv-content").inner_text()
                    page.keyboard.press("Escape")
                cv_btn = page.locator("#hero-cv-btn")
                if language == "en":
                    assert "CV_Samy_Houchat_EN.pdf" in cv_btn.get_attribute("href")
                    assert cv_btn.get_attribute("download") == "CV_Samy_Houchat_Internship_Data_Analyst_BI.pdf"
                else:
                    assert "CV_Samy_Houchat.pdf" in cv_btn.get_attribute("href")
                    assert cv_btn.get_attribute("download") == "CV_Samy_Houchat_Stage_Data_Analyst_BI.pdf"
                assert not errors, errors
                assert not bad_responses, bad_responses
                # Verify a real language navigation works, including without JS.
                alternate = "en" if language == "fr" else "fr"
                page.locator(f".language-switch a[lang='{alternate}']").click()
                page.wait_for_load_state("networkidle")
                assert page.locator("html").get_attribute("lang") == alternate
                context.close()
                checks += 1
                print(f"PASS: {language}, {width}px, JS={javascript}: content, tabs, layout, links and interactions")
        browser.close()
        print(f"PASS: {checks} browser scenarios")
finally:
    server.shutdown()
    server.server_close()
