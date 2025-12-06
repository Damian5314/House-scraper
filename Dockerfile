FROM apify/actor-python-playwright:3.11

# Werkdirectory binnen de container
WORKDIR /usr/src/app

# Vereisten kopiëren en installeren
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Rest van de code kopiëren
COPY . ./

# Standaard command: run de scraper
CMD ["python", "scraper_playwright.py"]
