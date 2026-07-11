"""
SpamShield AI — Flask Backend with Machine Learning
====================================================
TF-IDF Vectorizer + Multinomial Naive Bayes spam classifier.

Usage:
  pip install -r requirements.txt
  python app.py

The server starts on http://localhost:5000
The model trains automatically on first run if no saved model exists.
"""

import os
import re
import json
import joblib
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "assets")
MODEL_PATH = os.path.join(MODEL_DIR, "spam_model.joblib")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.joblib")

os.makedirs(MODEL_DIR, exist_ok=True)

app = Flask(__name__, static_folder="static", template_folder="templates")

# ---------------------------------------------------------------------------
# Training Dataset (spam + ham examples)
# ---------------------------------------------------------------------------
SPAM_EMAILS = [
    "CONGRATULATIONS!!! You have won $1,000,000 in our annual lottery! To claim your prize, click here immediately and provide your bank account details. This is a limited time offer! Act now before it expires!",
    "URGENT: Your PayPal account has been suspended due to suspicious activity. To restore access, please click the link below and verify your identity by providing your password, credit card number, and social security number within 24 hours.",
    "Dear Friend, I am Prince Barrister from Nigeria. I have $25 million dollars in unclaimed funds. I need your help to transfer this money. You will receive 30% for your assistance. Please provide your bank account and routing number.",
    "FREE FREE FREE! Get your free iPhone 15 Pro Max now! No purchase necessary! Just click here and enter your email address. Limited supply! Act now! This is a 100% risk-free guaranteed offer!",
    "VIAGRA 80% OFF! Best prices guaranteed! No prescription needed! Buy now and get free shipping worldwide! Click here to order. Limited time offer! Act now!",
    "You have been selected as the WINNER of our $500 Amazon gift card giveaway! Claim your prize now by clicking the link below. Offer expires today! Don't miss out!",
    "Dear Beneficiary, This is to inform you that you have been awarded a grant of $2,000,000 USD from the United Nations. To claim, please send your personal details and bank information.",
    "MAKE MONEY FAST! Work from home and earn $5000 per week! No experience needed! Guaranteed income! Click here to start earning today! This is a once in a lifetime opportunity!",
    "Your package could not be delivered. Please click here to confirm your address and pay a $2.99 redelivery fee. UPS Delivery Notification - Action Required Within 24 Hours.",
    "ATTENTION: Your bank account has been compromised! Please log in immediately by clicking this link to verify your identity and restore access. Failure to act will result in account closure.",
    "Lose 30 pounds in 30 days! Miracle weight loss pill! Doctor approved! No diet or exercise needed! Order now and get 50% off! Click here to buy!",
    "Investment Opportunity! Double your money in 7 days guaranteed! Crypto investment platform. Send Bitcoin to the address below and receive 2x returns. Risk-free!",
    "Dear Account Holder, We have detected unusual activity on your account. Please verify your identity by clicking here and providing your password, SSN, and credit card details. Immediate action required.",
    "YOU ARE A WINNER! Claim your $10,000 Walmart gift card now! Just complete this short survey and provide your email. Offer expires in 24 hours! Don't delay!",
    "Hot stock tip! This penny stock will explode 500% next week! Insider information! Guaranteed returns! Buy now before it's too late! Click here for free report!",
    "Nigerian Prince needs your help to transfer $50 million. You will receive 25% commission. Please send bank details, social security number, and $500 processing fee via wire transfer.",
    "Your Apple ID has been locked! Verify your account immediately by clicking here. Failure to verify within 24 hours will result in permanent suspension. Apple Security Team.",
    "CONGRATULATIONS! You've been pre-approved for a $50,000 loan with 0% interest! No credit check! Bad credit OK! Click here to apply now! Limited time offer!",
    "Earn passive income from home! $10,000 per month guaranteed! No skills needed! Click here to learn the secret formula! This won't last! Act now before this page is removed!",
    "IRS Tax Refund: You are owed a refund of $1,200. To receive your refund, please verify your identity by providing your SSN, date of birth, and bank account details. Click here now.",
]

HAM_EMAILS = [
    "Hi team, just wanted to share a quick update on the project. We've completed the first phase of testing and everything looks good so far. The next sprint planning meeting is scheduled for Thursday at 2 PM.",
    "Dear John, thank you for your recent purchase. Your order #12345 has been shipped and will arrive within 3-5 business days. You can track your package using the link provided in your account.",
    "Good morning everyone, please find attached the agenda for tomorrow's quarterly review meeting. Let me know if you have any questions or need any additional information before the meeting.",
    "Hi Sarah, I hope you're doing well. I wanted to follow up on our discussion from last week regarding the marketing campaign. Could we schedule a call sometime this week to go over the details?",
    "Your monthly statement is now available. Please log in to your account to view your statement. If you have any questions, please don't hesitate to contact our customer service team.",
    "Hey Mike, thanks for sending over the documents. I've reviewed them and everything looks great. I'll get the signed copies back to you by end of day tomorrow. Let me know if you need anything else.",
    "Dear Customer, your reservation at Grand Hotel has been confirmed for March 15-17. Check-in is at 3 PM. We look forward to welcoming you. Please contact us if you need any modifications.",
    "The weekly newsletter is here! This week we cover: new product launches, industry insights, and upcoming events. Click below to read the full newsletter on our website.",
    "Hi everyone, just a reminder that the office will be closed on Monday for the holiday. Please plan accordingly and let your managers know if you have any urgent deadlines.",
    "Thank you for subscribing to our blog. You'll now receive notifications when we publish new articles. You can manage your subscription preferences at any time from your account settings.",
    "Dear Professor, I am writing to request an extension on my research paper. I've been dealing with some health issues and would greatly appreciate an additional week to complete the assignment.",
    "Good afternoon, this is a courtesy reminder that your annual subscription renewal is coming up next month. Your current plan will automatically renew unless you choose to cancel.",
    "Hi Jessica, congratulations on your promotion! The team is thrilled for you. We'd love to take you out for lunch next week to celebrate. Let us know what day works best for you.",
    "Your password will expire in 7 days. Please update your password before then to ensure uninterrupted access to your account. You can change it in Settings > Security.",
    "Hello, I'm reaching out regarding the job application you submitted. We'd like to invite you for an interview next Tuesday at 10 AM. Please confirm your availability. Looking forward to speaking with you.",
    "Dear members, the community center will be hosting a free workshop on digital literacy this Saturday from 10 AM to 12 PM. All are welcome to attend. No registration required.",
    "Hi David, I've attached the quarterly report for your review. The numbers look strong this quarter with a 15% increase in revenue. Let's discuss in our meeting on Friday.",
    "Your package has been delivered. Thank you for shopping with us. If you have any issues with your order, please contact our support team within 30 days for assistance.",
    "Welcome to the team! We're excited to have you on board. Your first day will be Monday, March 1st. Please arrive by 9 AM and report to the front desk. We'll get you set up with everything you need.",
    "The board meeting has been rescheduled to next Wednesday at 2 PM in Conference Room A. Please update your calendars accordingly. Agenda and supporting documents will be sent separately.",
]

# ---------------------------------------------------------------------------
# Suspicious keywords for extraction
# ---------------------------------------------------------------------------
SUSPICIOUS_KEYWORDS = [
    "free", "winner", "congratulations", "lottery", "prize", "claim",
    "urgent", "guaranteed", "click here", "act now", "limited time",
    "wire transfer", "bitcoin", "nigerian prince", "password", "verify",
    "suspended", "bank account", "credit card", "social security",
    "dear friend", "million dollars", "risk-free", "no obligation",
    "viagra", "weight loss", "investment opportunity", "crypto",
    "make money fast", "work from home", "no credit check",
    "double your money", "passive income", "pre-approved",
    "free money", "cash bonus", "miracle", "secret formula",
    "once in a lifetime", "expires today", "final notice",
    "account suspended", "verify your account", "confirm your identity",
    "irs", "tax refund", "inheritance", "next of kin",
]

URGENCY_KEYWORDS = [
    "act now", "urgent", "immediately", "expires today", "final notice",
    "last chance", "limited time", "hurry", "deadline", "within 24 hours",
    "don't delay", "respond now", "before it's too late",
]


# ---------------------------------------------------------------------------
# Model Training
# ---------------------------------------------------------------------------
def train_model():
    """Train TF-IDF + MultinomialNB pipeline and save to disk."""
    print("[SpamShield AI] Training model...")

    texts = SPAM_EMAILS + HAM_EMAILS
    labels = [1] * len(SPAM_EMAILS) + [0] * len(HAM_EMAILS)

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=5000,
        ngram_range=(1, 2),
        lowercase=True,
    )
    classifier = MultinomialNB(alpha=0.1)

    pipeline = Pipeline([
        ("tfidf", vectorizer),
        ("nb", classifier),
    ])

    pipeline.fit(texts, labels)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"[SpamShield AI] Model saved to {MODEL_PATH}")
    return pipeline


def load_model():
    """Load the model from disk, or train if it doesn't exist."""
    if os.path.exists(MODEL_PATH):
        print("[SpamShield AI] Loading existing model...")
        return joblib.load(MODEL_PATH)
    return train_model()


# Load model on startup
model = load_model()


# ---------------------------------------------------------------------------
# Analysis helpers
# ---------------------------------------------------------------------------
def extract_keywords(text):
    """Extract suspicious keywords found in the text."""
    lower = text.lower()
    found = []
    for kw in SUSPICIOUS_KEYWORDS:
        if kw in lower and kw not in found:
            found.append(kw)
    return found[:10]


def calculate_risk(probability):
    """Map probability to risk level."""
    if probability >= 0.75:
        return "Critical"
    elif probability >= 0.5:
        return "High"
    elif probability >= 0.25:
        return "Medium"
    return "Low"


def heuristic_bonus(text):
    """Add heuristic score adjustments on top of ML probability."""
    lower = text.lower()
    bonus = 0.0

    # Urgency keywords
    for kw in URGENCY_KEYWORDS:
        if kw in lower:
            bonus += 0.03

    # Excessive exclamation marks
    exclam_count = text.count("!")
    if exclam_count > 5:
        bonus += 0.05

    # Excessive uppercase
    words = text.split()
    if words:
        upper_ratio = sum(1 for w in words if len(w) > 3 and w.isupper()) / len(words)
        if upper_ratio > 0.15:
            bonus += 0.05

    # Multiple URLs
    url_count = len(re.findall(r"https?://", text, re.IGNORECASE))
    if url_count >= 3:
        bonus += 0.05

    return min(bonus, 0.2)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/")
def index():
    """Serve the main HTML page."""
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    """Serve static files (CSS, JS, images)."""
    static_dir = os.path.join(BASE_DIR, "static")
    if os.path.exists(os.path.join(static_dir, path)):
        return send_from_directory(static_dir, path)
    # Also check public/ (Vite dev server convention)
    public_dir = os.path.join(BASE_DIR, "public")
    if os.path.exists(os.path.join(public_dir, path)):
        return send_from_directory(public_dir, path)
    # Fallback to index.html for SPA-like behavior
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/predict", methods=["POST"])
def predict():
    """Analyze email text and return spam prediction."""
    try:
        data = request.get_json(force=True)
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "No text provided"}), 400

        # ML prediction
        proba = model.predict_proba([text])[0]
        spam_probability = float(proba[1])  # Probability of being spam

        # Heuristic adjustment
        bonus = heuristic_bonus(text)
        adjusted_prob = min(1.0, spam_probability + bonus)

        prediction = "Spam" if adjusted_prob >= 0.5 else "Ham"
        confidence = round(adjusted_prob * 100 if prediction == "Spam" else (1 - adjusted_prob) * 100)
        risk = calculate_risk(adjusted_prob)
        keywords = extract_keywords(text)

        return jsonify({
            "prediction": prediction,
            "probability": round(adjusted_prob, 4),
            "confidence": confidence,
            "risk": risk,
            "keywords": keywords,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health")
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "model": "loaded"})


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("=" * 50)
    print("  SpamShield AI — Server Starting")
    print("=" * 50)
    print(f"  Model: {MODEL_PATH}")
    print(f"  Endpoint: http://localhost:5000/predict")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=True)
