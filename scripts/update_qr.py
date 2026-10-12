#!/usr/bin/env python3
"""Generate fresh web CV QR assets locally (optional dependency: qrcode==8.2)."""
from pathlib import Path
import xml.etree.ElementTree as ET
import qrcode
import qrcode.image.svg

URL = "https://hctsamyuct.github.io/"
ROOT = Path(__file__).resolve().parents[1]
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=4)
qr.add_data(URL)
qr.make(fit=True)
qr.make_image(fill_color="black", back_color="white").save(ROOT / "assets/img/qr-portfolio-cv.png")
svg = qr.make_image(image_factory=qrcode.image.svg.SvgPathFillImage)
tree = ET.fromstring(svg.to_string())
ET.register_namespace("", "http://www.w3.org/2000/svg")
title = ET.Element("{http://www.w3.org/2000/svg}title")
title.text = "Portfolio de Samy Houchat"
description = ET.Element("{http://www.w3.org/2000/svg}desc")
description.text = URL
tree.insert(0, description)
tree.insert(0, title)
ET.ElementTree(tree).write(ROOT / "assets/img/qr-portfolio-cv.svg", encoding="utf-8", xml_declaration=True)
print("Generated PNG/SVG QR codes for", URL)
