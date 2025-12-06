#!/usr/bin/env python3
"""
Huizen Scraper - Meerdere Nederlandse platforms
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import csv
from dataclasses import dataclass, asdict
from typing import Optional
from abc import ABC, abstractmethod


@dataclass
class Woning:
    titel: str
    prijs: str
    adres: str
    oppervlakte: Optional[str]
    kamers: Optional[str]
    url: str
    platform: str


class BaseScraper(ABC):
    """Basis class voor alle scrapers."""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
        })
    
    @abstractmethod
    def scrape(self, plaats: str, max_paginas: int) -> list[Woning]:
        pass


class ParariusScraper(BaseScraper):
    """Scraper voor Pararius.nl"""
    
    naam = "Pararius"
    base_url = "https://www.pararius.nl"
    
    def scrape(self, plaats: str, max_paginas: int = 2) -> list[Woning]:
        print(f"\n🏠 Scraping {self.naam} voor {plaats}...")
        woningen = []
        
        for pagina in range(1, max_paginas + 1):
            url = f"{self.base_url}/koopwoningen/{plaats}/page-{pagina}"
            print(f"   📄 Pagina {pagina}...")
            
            try:
                response = self.session.get(url, timeout=10)
                if response.status_code != 200:
                    break
                    
                soup = BeautifulSoup(response.text, 'html.parser')
                listings = soup.find_all('section', class_='listing-search-item')
                
                if not listings:
                    break
                
                for listing in listings:
                    try:
                        link = listing.find('a', class_='listing-search-item__link--title')
                        titel = link.text.strip() if link else 'Onbekend'
                        woning_url = self.base_url + link.get('href', '') if link else ''
                        
                        prijs_el = listing.find('div', class_='listing-search-item__price')
                        prijs = prijs_el.text.strip() if prijs_el else 'Onbekend'
                        
                        loc_el = listing.find('div', class_='listing-search-item__sub-title')
                        adres = loc_el.text.strip() if loc_el else 'Onbekend'
                        
                        kenmerken = listing.find_all('li', class_='illustrated-features__item')
                        oppervlakte = kamers = None
                        for k in kenmerken:
                            tekst = k.text.strip()
                            if 'm²' in tekst:
                                oppervlakte = tekst
                            elif 'kamer' in tekst.lower():
                                kamers = tekst
                        
                        woningen.append(Woning(
                            titel=titel, prijs=prijs, adres=adres,
                            oppervlakte=oppervlakte, kamers=kamers,
                            url=woning_url, platform=self.naam
                        ))
                    except Exception as e:
                        continue
                
                print(f"   ✅ {len(listings)} woningen gevonden")
                time.sleep(1)
                
            except Exception as e:
                print(f"   ❌ Fout: {e}")
                break
        
        return woningen


class HuislijnScraper(BaseScraper):
    """Scraper voor Huislijn.nl"""
    
    naam = "Huislijn"
    base_url = "https://www.huislijn.nl"
    
    def scrape(self, plaats: str, max_paginas: int = 2) -> list[Woning]:
        print(f"\n🏠 Scraping {self.naam} voor {plaats}...")
        woningen = []
        
        for pagina in range(1, max_paginas + 1):
            url = f"{self.base_url}/koopwoning/{plaats}?page={pagina}"
            print(f"   📄 Pagina {pagina}...")
            
            try:
                response = self.session.get(url, timeout=10)
                if response.status_code != 200:
                    break
                
                soup = BeautifulSoup(response.text, 'html.parser')
                listings = soup.find_all('div', class_='property-item')
                
                if not listings:
                    # Probeer alternatieve selector
                    listings = soup.find_all('article', class_='listing')
                
                if not listings:
                    print(f"   ⚠️ Geen resultaten gevonden")
                    break
                
                for listing in listings:
                    try:
                        # Zoek link en titel
                        link = listing.find('a', href=True)
                        titel_el = listing.find(['h2', 'h3', 'h4']) or listing.find(class_='street')
                        titel = titel_el.text.strip() if titel_el else 'Onbekend'
                        
                        href = link.get('href', '') if link else ''
                        woning_url = href if href.startswith('http') else self.base_url + href
                        
                        # Prijs
                        prijs_el = listing.find(class_='price') or listing.find(class_='koopprijs')
                        prijs = prijs_el.text.strip() if prijs_el else 'Onbekend'
                        
                        # Adres/locatie
                        adres_el = listing.find(class_='location') or listing.find(class_='city')
                        adres = adres_el.text.strip() if adres_el else plaats.title()
                        
                        # Oppervlakte
                        opp_el = listing.find(class_='surface') or listing.find(class_='oppervlakte')
                        oppervlakte = opp_el.text.strip() if opp_el else None
                        
                        woningen.append(Woning(
                            titel=titel, prijs=prijs, adres=adres,
                            oppervlakte=oppervlakte, kamers=None,
                            url=woning_url, platform=self.naam
                        ))
                    except Exception as e:
                        continue
                
                print(f"   ✅ {len(listings)} woningen gevonden")
                time.sleep(1)
                
            except Exception as e:
                print(f"   ❌ Fout: {e}")
                break
        
        return woningen


class ZAHScraper(BaseScraper):
    """Scraper voor ZoekAlleHuizen.nl (ZAH)"""
    
    naam = "ZoekAlleHuizen"
    base_url = "https://www.zah.nl"
    
    def scrape(self, plaats: str, max_paginas: int = 2) -> list[Woning]:
        print(f"\n🏠 Scraping {self.naam} voor {plaats}...")
        woningen = []
        
        for pagina in range(1, max_paginas + 1):
            url = f"{self.base_url}/koop/{plaats}/?p={pagina}"
            print(f"   📄 Pagina {pagina}...")
            
            try:
                response = self.session.get(url, timeout=10)
                if response.status_code != 200:
                    break
                
                soup = BeautifulSoup(response.text, 'html.parser')
                listings = soup.find_all('div', class_='residence-item') or soup.find_all('div', class_='house-item')
                
                if not listings:
                    listings = soup.find_all('article')
                
                if not listings:
                    print(f"   ⚠️ Geen resultaten")
                    break
                
                for listing in listings:
                    try:
                        link = listing.find('a', href=True)
                        titel_el = listing.find(['h2', 'h3']) or listing.find(class_='address')
                        titel = titel_el.text.strip() if titel_el else 'Onbekend'
                        
                        href = link.get('href', '') if link else ''
                        woning_url = href if href.startswith('http') else self.base_url + href
                        
                        prijs_el = listing.find(class_='price') or listing.find(class_='prijs')
                        prijs = prijs_el.text.strip() if prijs_el else 'Onbekend'
                        
                        woningen.append(Woning(
                            titel=titel, prijs=prijs, adres=plaats.title(),
                            oppervlakte=None, kamers=None,
                            url=woning_url, platform=self.naam
                        ))
                    except:
                        continue
                
                print(f"   ✅ {len(listings)} woningen gevonden")
                time.sleep(1)
                
            except Exception as e:
                print(f"   ❌ Fout: {e}")
                break
        
        return woningen


class HuispediaScraper(BaseScraper):
    """Scraper voor Huispedia.nl"""
    
    naam = "Huispedia"
    base_url = "https://www.huispedia.nl"
    
    def scrape(self, plaats: str, max_paginas: int = 2) -> list[Woning]:
        print(f"\n🏠 Scraping {self.naam} voor {plaats}...")
        woningen = []
        
        url = f"{self.base_url}/koopwoningen/{plaats}"
        print(f"   📄 Ophalen...")
        
        try:
            response = self.session.get(url, timeout=10)
            if response.status_code != 200:
                print(f"   ❌ Status {response.status_code}")
                return woningen
            
            soup = BeautifulSoup(response.text, 'html.parser')
            listings = soup.find_all('div', class_='house-card') or soup.find_all('article')
            
            for listing in listings[:30 * max_paginas]:  # Limiteer resultaten
                try:
                    link = listing.find('a', href=True)
                    titel_el = listing.find(['h2', 'h3', 'h4'])
                    titel = titel_el.text.strip() if titel_el else 'Onbekend'
                    
                    href = link.get('href', '') if link else ''
                    woning_url = href if href.startswith('http') else self.base_url + href
                    
                    prijs_el = listing.find(class_='price')
                    prijs = prijs_el.text.strip() if prijs_el else 'Onbekend'
                    
                    woningen.append(Woning(
                        titel=titel, prijs=prijs, adres=plaats.title(),
                        oppervlakte=None, kamers=None,
                        url=woning_url, platform=self.naam
                    ))
                except:
                    continue
            
            print(f"   ✅ {len(woningen)} woningen gevonden")
            
        except Exception as e:
            print(f"   ❌ Fout: {e}")
        
        return woningen


class MarktplaatsScraper(BaseScraper):
    """Scraper voor Marktplaats.nl huizen"""
    
    naam = "Marktplaats"
    base_url = "https://www.marktplaats.nl"
    
    def scrape(self, plaats: str, max_paginas: int = 2) -> list[Woning]:
        print(f"\n🏠 Scraping {self.naam} voor {plaats}...")
        woningen = []
        
        for pagina in range(1, max_paginas + 1):
            url = f"{self.base_url}/l/huizen-en-kamers/huizen-te-koop/q/{plaats}/#f:10,11|currentPage:{pagina}"
            print(f"   📄 Pagina {pagina}...")
            
            try:
                response = self.session.get(url, timeout=10)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                listings = soup.find_all('li', class_='mp-Listing')
                if not listings:
                    listings = soup.find_all('article')
                
                if not listings:
                    print(f"   ⚠️ Geen resultaten (mogelijk JS-rendering nodig)")
                    break
                
                for listing in listings:
                    try:
                        link = listing.find('a', href=True)
                        titel_el = listing.find(class_='mp-Listing-title')
                        titel = titel_el.text.strip() if titel_el else 'Onbekend'
                        
                        href = link.get('href', '') if link else ''
                        woning_url = href if href.startswith('http') else self.base_url + href
                        
                        prijs_el = listing.find(class_='mp-Listing-price')
                        prijs = prijs_el.text.strip() if prijs_el else 'Onbekend'
                        
                        woningen.append(Woning(
                            titel=titel, prijs=prijs, adres=plaats.title(),
                            oppervlakte=None, kamers=None,
                            url=woning_url, platform=self.naam
                        ))
                    except:
                        continue
                
                print(f"   ✅ {len(listings)} woningen gevonden")
                time.sleep(1)
                
            except Exception as e:
                print(f"   ❌ Fout: {e}")
                break
        
        return woningen


class MultiPlatformScraper:
    """Hoofdscraper die alle platforms combineert."""
    
    def __init__(self):
        self.scrapers = {
            'pararius': ParariusScraper(),
            'huislijn': HuislijnScraper(),
            'zah': ZAHScraper(),
            'huispedia': HuispediaScraper(),
            'marktplaats': MarktplaatsScraper(),
        }
        self.woningen = []
    
    def scrape_all(self, plaats: str, max_paginas: int = 2, platforms: list = None):
        """Scrape alle of geselecteerde platforms."""
        
        if platforms is None:
            platforms = list(self.scrapers.keys())
        
        for platform in platforms:
            if platform in self.scrapers:
                try:
                    resultaten = self.scrapers[platform].scrape(plaats, max_paginas)
                    self.woningen.extend(resultaten)
                except Exception as e:
                    print(f"   ❌ {platform} mislukt: {e}")
        
        # Verwijder duplicaten op basis van URL
        gezien = set()
        uniek = []
        for w in self.woningen:
            if w.url not in gezien:
                gezien.add(w.url)
                uniek.append(w)
        self.woningen = uniek
        
        return self.woningen
    
    def exporteer_json(self, bestandsnaam='woningen_alle_platforms.json'):
        with open(bestandsnaam, 'w', encoding='utf-8') as f:
            json.dump([asdict(w) for w in self.woningen], f, ensure_ascii=False, indent=2)
        print(f"\n✅ {len(self.woningen)} woningen → {bestandsnaam}")
    
    def exporteer_csv(self, bestandsnaam='woningen_alle_platforms.csv'):
        with open(bestandsnaam, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Titel', 'Prijs', 'Adres', 'Oppervlakte', 'Kamers', 'URL', 'Platform'])
            for w in self.woningen:
                writer.writerow([w.titel, w.prijs, w.adres, w.oppervlakte, w.kamers, w.url, w.platform])
        print(f"✅ {len(self.woningen)} woningen → {bestandsnaam}")
    
    def toon_samenvatting(self):
        print("\n" + "=" * 60)
        print("📊 SAMENVATTING")
        print("=" * 60)
        
        # Tel per platform
        per_platform = {}
        for w in self.woningen:
            per_platform[w.platform] = per_platform.get(w.platform, 0) + 1
        
        for platform, aantal in sorted(per_platform.items(), key=lambda x: -x[1]):
            print(f"   {platform}: {aantal} woningen")
        
        print(f"\n   TOTAAL: {len(self.woningen)} woningen")
    
    def toon_resultaten(self, max_tonen=10):
        print("\n" + "=" * 60)
        print("🏠 GEVONDEN WONINGEN")
        print("=" * 60)
        
        for i, w in enumerate(self.woningen[:max_tonen], 1):
            print(f"\n{i}. [{w.platform}] {w.titel}")
            print(f"   💰 {w.prijs}")
            print(f"   📍 {w.adres}")
            if w.oppervlakte:
                print(f"   📐 {w.oppervlakte}")
        
        if len(self.woningen) > max_tonen:
            print(f"\n... en nog {len(self.woningen) - max_tonen} meer (zie CSV/JSON)")


def main():
    print("=" * 60)
    print("🏠 HUIZEN SCRAPER - ALLE PLATFORMS")
    print("=" * 60)
    print("\nBeschikbare platforms:")
    print("  1. Pararius")
    print("  2. Huislijn")
    print("  3. ZoekAlleHuizen")
    print("  4. Huispedia")
    print("  5. Marktplaats")
    print("  A. ALLE platforms")
    
    keuze = input("\nWelke platforms? (1,2,3 of A voor alle): ").strip().upper()
    
    platform_map = {
        '1': ['pararius'],
        '2': ['huislijn'],
        '3': ['zah'],
        '4': ['huispedia'],
        '5': ['marktplaats'],
    }
    
    if keuze == 'A' or keuze == '':
        platforms = None  # Alle platforms
    else:
        platforms = []
        for k in keuze.replace(' ', '').split(','):
            if k in platform_map:
                platforms.extend(platform_map[k])
    
    plaats = input("Welke stad? (bijv. amsterdam): ").strip().lower() or "amsterdam"
    paginas = int(input("Hoeveel pagina's per platform? (standaard 2): ").strip() or "2")
    
    scraper = MultiPlatformScraper()
    scraper.scrape_all(plaats, max_paginas=paginas, platforms=platforms)
    
    if scraper.woningen:
        scraper.toon_samenvatting()
        scraper.toon_resultaten()
        scraper.exporteer_json()
        scraper.exporteer_csv()
    else:
        print("\n⚠️ Geen woningen gevonden")


if __name__ == "__main__":
    main()