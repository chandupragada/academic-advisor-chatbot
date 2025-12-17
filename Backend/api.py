from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app) 
@app.route('/api/chat', methods=['POST'])
def chat_proxy():
    try:
        data = request.json
        history = data.get('history', [])
        model_name = "gemini-flash-latest"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
        
        payload = {
            "contents": history,
            "generationConfig": {
                "maxOutputTokens": 1000,
                "temperature": 0.7
            }
        }

        response = requests.post(
            url, 
            json=payload, 
            params={"key": API_KEY}, 
            headers={"Content-Type": "application/json"}
        )

        response.raise_for_status() 
        return jsonify(response.json())

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Runs on http://localhost:5000 by default
    app.run(port=5000, debug=True)