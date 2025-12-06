#!/usr/bin/env python3
import csv
import json
import random
import re
import time
from dataclasses import dataclass, asdict

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


@dataclass
class Woning:
    titel: str
    prijs: str
    adres: str
    postcode: str
    plaats: str
    oppervlakte: str
    kamers: str
    url: str
    platform: str


class SeleniumScraper:
    def __init__(self, headless: bool = False):
        self.headless = headless
        self.driver = None
        self.woningen: list[Woning] = []

    # ----------------- algemene helpers -----------------

    def start_browser(self):
        print("Browser starten...")
        options = Options()
        if self.headless:
            options.add_argument("--headless=new")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--no-sandbox")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--lang=nl-NL")
        options.add_argument(
            "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("useAutomationExtension", False)

        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)

        # webdriver verbergen
        self.driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {
                "source": 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'
            },
        )
        print("Browser gestart!\n")

    def stop_browser(self):
        if self.driver:
