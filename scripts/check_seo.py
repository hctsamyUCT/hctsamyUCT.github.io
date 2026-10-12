#!/usr/bin/env python3
"""Dependency-free SEO regression checks for the HTML actually shipped to Pages."""
from datetime import date
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import tempfile
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://hctsamyuct.github.io/"
INDEXABLE = {"index.html": BASE, "cv_samy_houchat.html": BASE + "cv_samy_houchat.html"}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.meta = {}
        self.canonicals = []
        self.ids = set()
        self.links = []
        self.images = []
        self.h1 = 0
        self.mains = 0
        self.title = ""
        self.text = []
        self.scripts = []
        self.active_script = None
        self.in_title = False
        self.in_style = False
        self.lang = None
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            require(a["id"] not in self.ids, f"{self.path.name}: duplicate id {a['id']}")
            self.ids.add(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self.in_title = True
        elif tag == "style":
            self.in_style = True
        elif tag == "script":
            self.active_script = [a, ""]
        elif tag == "meta":
            key = a.get("name", a.get("property"))
            if key:
                require(key not in self.meta, f"{self.path.name}: duplicate metadata {key}")
                self.meta[key] = a.get("content", "")
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href"))
        elif tag == "h1":
            self.h1 += 1
        elif tag == "main":
            self.mains += 1
        if tag == "img":
            self.images.append(a)
            require(bool(a.get("alt", "").strip()), f"{self.path.name}: image missing descriptive alt")
        if tag == "a":
            self.links.append(a.get("href", ""))
        if tag in {"img", "script", "link"}:
            self.check_resource(a.get("src", a.get("href", "")))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "style":
            self.in_style = False
        elif tag == "script" and self.active_script is not None:
            self.scripts.append(self.active_script)
            self.active_script = None

    def handle_data(self, data):
        if self.active_script is not None:
            self.active_script[1] += data
        elif self.in_title:
            self.title += data
        elif not self.in_style:
            self.text.append(data)

    def check_resource(self, url):
        u = urlsplit(url)
        if u.scheme or u.netloc or not u.path:
            return
        target = ROOT / unquote(u.path.lstrip("/"))
        require(target.is_file(), f"{self.path.name}: missing local asset {url}")


pages = {name: Page(ROOT / name) for name in [*INDEXABLE, "404.html"]}
for name, url in INDEXABLE.items():
    p = pages[name]
    require(p.lang == "fr", f"{name}: expected French language")
    require(p.h1 == 1 and p.mains == 1, f"{name}: expected one H1 and one main landmark")
    require("Samy Houchat" in p.title, f"{name}: missing name in title")
    require(p.canonicals == [url], f"{name}: incorrect canonical")
    require(bool(p.meta.get("description")), f"{name}: missing description")
    require("noindex" not in p.meta.get("robots", ""), f"{name}: indexable page blocked")
    require(p.meta.get("og:url") == url, f"{name}: social URL differs from canonical")
    for key in ["og:title", "og:description", "og:image:alt", "twitter:title",
                "twitter:description", "twitter:card", "twitter:image:alt"]:
        require(bool(p.meta.get(key)), f"{name}: missing {key}")
    for key in ["og:image", "twitter:image"]:
        image = p.meta.get(key, "")
        require(image.startswith(BASE), f"{name}: {key} must use the production origin")
        resource = ROOT / unquote(urlsplit(image).path.lstrip("/"))
        require(resource.is_file() and resource.suffix.lower() in {".png", ".jpg", ".jpeg"},
                f"{name}: social image must be an existing PNG/JPEG")
    schemas = [json.loads(body) for attrs, body in p.scripts if attrs.get("type") == "application/ld+json"]
    require(len(schemas) == 1, f"{name}: expected one JSON-LD graph")
    schema = schemas[0]
    require(schema.get("@context") == "https://schema.org", f"{name}: invalid schema context")
    graph = schema["@graph"]
    person = next(x for x in graph if x["@type"] == "Person")
    require((person["name"], person["givenName"], person["familyName"], person["alternateName"])
            == ("Samy Houchat", "Samy", "Houchat", "Houchat Samy"), f"{name}: inconsistent identity")
    require(person["@id"] == BASE + "#samy-houchat" and person["url"] == BASE,
            f"{name}: incorrect Person URL")
    require("Samy" in " ".join(p.text) and "Houchat" in " ".join(p.text), f"{name}: no visible identity")
    webpage = next(x for x in graph if x["@type"] in {"ProfilePage", "WebPage"})
    require(webpage["url"] == url and webpage["mainEntity"]["@id"] == person["@id"],
            f"{name}: inconsistent page entity")
    require(webpage["description"] == p.meta["description"], f"{name}: schema/description differ")
    require(all(link in p.links for link in person["sameAs"] if "linkedin" in link),
            f"{name}: structured profile link absent from HTML")

require(pages["index.html"].title != pages["cv_samy_houchat.html"].title, "Page titles must be distinct")
require(pages["index.html"].meta["description"] != pages["cv_samy_houchat.html"].meta["description"],
        "Page descriptions must be distinct")
require("noindex" in pages["404.html"].meta.get("robots", ""), "404 must be noindex")

for name, p in pages.items():
    for link in p.links:
        u = urlsplit(link)
        if u.scheme or u.netloc:
            continue
        if not u.path:
            require(not u.fragment or unquote(u.fragment) in p.ids, f"{name}: broken anchor {link}")
        elif u.path == "/":
            continue
        else:
            target = ROOT / unquote(u.path.lstrip("/"))
            require(target.is_file(), f"{name}: broken local link {link}")

source = (ROOT / "index.html").read_text()
for id in ["stats-grid", "featured-project-container", "other-projects-grid", "skills-categories-grid",
           "timeline-container", "education-list", "languages-list", "contact-search-desc"]:
    block = source.split(f"<!-- seo:{id}:start -->", 1)[1].split(f"<!-- seo:{id}:end -->", 1)[0]
    require(bool(block.strip()), f"Missing crawlable content: {id}")
visible = " ".join(pages["index.html"].text)
for term in ["Power BI", "Python", "SQL", "Layer Data", "AVDA", "FacturaPro"]:
    require(term in visible, f"Content requires JavaScript: {term}")
require("data:image" not in source, "Avoid duplicated embedded images in index.html")

ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
sitemap = ET.parse(ROOT / "sitemap.xml").getroot()
locations = [x.text for x in sitemap.findall("s:url/s:loc", ns)]
require(set(locations) == set(INDEXABLE.values()) and len(locations) == len(INDEXABLE),
        "Sitemap must list each canonical indexable page exactly once")
for value in sitemap.findall("s:url/s:lastmod", ns):
    require(date.fromisoformat(value.text) <= date.today(), "Sitemap lastmod cannot be in the future")
robots = (ROOT / "robots.txt").read_text()
require("User-agent: *" in robots and "Allow: /" in robots and "Disallow: /" not in robots,
        "Public crawling must remain allowed")
require("Sitemap: " + BASE + "sitemap.xml" in robots, "robots.txt sitemap URL is incorrect")
qr = ET.parse(ROOT / "assets/img/qr-portfolio-cv.svg").getroot()
require(qr.find("{http://www.w3.org/2000/svg}desc").text == BASE,
        "Web CV QR code must describe the canonical portfolio URL")

# Parse the actual shipped inline JS with Node, without executing it in this check.
with tempfile.TemporaryDirectory(prefix="portfolio-seo-") as directory:
    for i, (attrs, body) in enumerate(pages["index.html"].scripts):
        if attrs.get("type") == "application/ld+json" or attrs.get("src"):
            continue
        script = Path(directory) / f"inline-{i}.js"
        script.write_text(body)
        subprocess.run(["node", "--check", str(script)], check=True)

print("PASS: 3 HTML pages, metadata, identity/schema, crawlable content, local links/assets, sitemap, robots and shipped JavaScript.")
