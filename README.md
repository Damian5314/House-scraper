# Huizen scraper (Funda & Pararius) – Playwright (Python)

Deze Actor scrapet woningen van **Funda** en **Pararius** met behulp van **Playwright (Python)**.  
Resultaten worden in de Apify **Dataset** opgeslagen (één item per woning).

## 🔧 Input

De Actor gebruikt `INPUT_SCHEMA.json` en heeft de volgende velden:

- **plaats** (string, verplicht)  
  Bijvoorbeeld: `amsterdam`, `utrecht`, `noord-holland`.  
  Wordt gebruikt in de URL:
  - Funda: als selected_area
  - Pararius: `/koopwoningen/{plaats}`

- **paginas** (integer, default `5`)  
  Aantal pagina's per platform dat gescrapet wordt.  
  Bijvoorbeeld: `10` betekent:
  - maximaal 10 Funda-pagina's
  - maximaal 10 Pararius-pagina's

- **platforms** (array, default `["FUNDA", "PARARIUS"]`)  
  Keuzes:
  - `FUNDA`
  - `PARARIUS`  
  Je kunt één of beide selecteren.

- **headless** (boolean, default `true`)  
  Of de browser headless draait.  
  Op Apify is `true` normaal gesproken gewenst.

## 🧪 Output

De Actor pusht per woning een object naar de Apify Dataset, met ongeveer deze velden:

- `platform` – `"Funda"` of `"Pararius"`
- `titel`
- `prijs`
- `adres`
- `postcode`
- `plaats`
- `oppervlakte`
- `kamers`
- `url`

Je kunt de dataset exporteren als:
- JSON
- CSV
- XLSX
- ndjson
enz.

## ▶️ Gebruik op Apify

1. Upload deze Actor (map `huizen_actor`) naar Apify.
2. Vul in het Actor-inputformulier:
   - `plaats`
   - `paginas`
   - `platforms`
   - eventueel `headless`
3. Run de Actor.
4. Bekijk de resultaten in de tab **Dataset**.

## 🏃‍♂️ Lokale ontwikkeling

Lokaal kun je de scraper ook draaien met Python (optioneel, afhankelijk van de implementatie in `scraper_playwright.py`):

```bash
python scraper_playwright.py --plaats amsterdam --paginas 3 --platforms FUNDA,PARARIUS
