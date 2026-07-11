# SpamShield AI

AI-Powered Spam Email Detection web application built with Flask, Scikit-learn, and vanilla JavaScript.

## Features

- **AI Spam Detection** — TF-IDF Vectorizer + Multinomial Naive Bayes classifier trained on spam/ham emails
- **Real-Time Analysis** — Paste any email and get instant threat assessment with radar scanning animation
- **Live Dashboard** — Chart.js visualizations: pie chart (spam vs safe), line chart (daily scans), bar chart (threat categories)
- **AI Chatbot** — Floating assistant that answers FAQs about SpamShield AI
- **API Documentation** — REST API with copy-to-clipboard code examples
- **Premium UI** — Glassmorphism design, particle background, animated blobs, mouse glow, card tilt, scroll reveals

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Python Flask |
| Machine Learning | Scikit-learn (TF-IDF + MultinomialNB) |
| Charts | Chart.js |
| Icons | Font Awesome |
| Animations | CSS animations, custom scroll reveal, particle canvas |

## Project Structure

```
SpamShield-AI/
│── index.html          # Main HTML page
│── style.css           # All styles (in public/ for Vite dev)
│── script.js           # All frontend JavaScript (in public/ for Vite dev)
│── app.py              # Flask backend with ML pipeline
│── requirements.txt   # Python dependencies
│── README.md           # This file
│── assets/             # Trained model files (auto-generated)
│── static/             # Static assets
│── templates/          # Jinja2 templates (if using Flask rendering)
```

## Quick Start

### 1. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Flask backend

```bash
python app.py
```

The server starts on `http://localhost:5000`. On first run, the ML model trains automatically and saves to `assets/spam_model.joblib`.

### 3. Open the website

Visit `http://localhost:5000` in your browser.

## API Reference

### POST /predict

Analyze email text for spam.

**Request:**
```json
{
  "text": "Your email content here"
}
```

**Response:**
```json
{
  "prediction": "Spam",
  "probability": 0.95,
  "confidence": 95,
  "risk": "Critical",
  "keywords": ["congratulations", "won", "claim", "click here"]
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| prediction | string | "Spam" or "Ham" |
| probability | float | 0.0 - 1.0 spam probability |
| confidence | int | 0 - 100 confidence score |
| risk | string | Low / Medium / High / Critical |
| keywords | array | Detected suspicious keywords |

### GET /health

Health check endpoint.

```json
{ "status": "ok", "model": "loaded" }
```

## How It Works

1. **TF-IDF Vectorization** — Email text is converted to numerical features using Term Frequency-Inverse Document Frequency
2. **Naive Bayes Classification** — A Multinomial Naive Bayes classifier trained on labeled spam/ham emails predicts the probability
3. **Heuristic Enhancement** — Rule-based adjustments for urgency keywords, excessive capitalization, URL count, and exclamation marks
4. **Risk Scoring** — Combined probability maps to a risk level: Low (<25%), Medium (25-50%), High (50-75%), Critical (75%+)

## Development (with Vite)

For frontend development with hot reload:

```bash
npm install
npm run dev
```

Vite serves the frontend on port 5173 and proxies `/predict` to Flask on port 5000.

## License

MIT
