from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv()
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
API_URL = "https://openrouter.ai/api/v1/chat/completions"

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message')
        
        # Prepare the request to OpenRouter
        headers = {
            'Authorization': f'Bearer {OPENROUTER_API_KEY}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173/',  # Your frontend URL
            'X-Title': 'StudyHive'
        }
        
        data = {
            "model": "deepseek/deepseek-r1-distill-llama-70b:free",
            "messages": [
                {
                    "role": "system",
                    "content": "You are StudyHive Bot, an AI study assistant focused on helping students learn and understand academic concepts."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        }
        
        # Make request to OpenRouter
        response = requests.post(API_URL, headers=headers, json=data)
        
        if response.status_code != 200:
            return jsonify({
                'error': f'API Error: {response.status_code}',
                'message': response.text
            }), response.status_code
            
        return jsonify(response.json())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 