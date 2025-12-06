# Huizen Scraper (Funda + Pararius)

Scraper voor koopwoningen op:

- https://www.funda.nl
- https://www.pararius.nl

Gebouwd voor Apify met Playwright (Python).

## Input

* **plaats** – Stad/plaats, bijv. `amsterdam`, `utrecht`, ...
* **paginas** – Aantal pagina's per platform (maximale diepte).
* **platforms** – `FUNDA`, `PARARIUS` of `ALL`.

## Output

Resultaten worden naar de Apify Dataset geschreven.  
Je kunt via de Apify UI de dataset downloaden als:

- JSON
- CSV
- Excel
- NDJSON

Elke rij heeft o.a.:

- `titel`
- `prijs`
- `adres`
- `postcode`
- `plaats`
- `oppervlakte`
- `kamers` (alleen Funda, Pararius is placeholder)
- `url`
- `platform`
