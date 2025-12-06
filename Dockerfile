# Officiële Apify base image met Python + Playwright
FROM apify/actor-python-playwright:latest

# Zorg dat stdout/err direct worden geflusht (handig voor logs)
ENV PYTHONUNBUFFERED=1

# Eerst alleen requirements kopiëren (beter voor Docker cache)
COPY requirements.txt ./

# Python dependencies installeren
RUN pip install --no-cache-dir -r requirements.txt

# Actor code kopiëren
COPY . ./

# Default command: start je scraper
CMD ["python", "-u", "scraper_playwright.py"]
