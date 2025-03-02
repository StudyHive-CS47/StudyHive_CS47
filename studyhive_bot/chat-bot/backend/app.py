from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import sqlite3
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

# Database setup
def init_db():
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER,
            role TEXT,
            content TEXT,
            timestamp TEXT,
            FOREIGN KEY (chat_id) REFERENCES chats (id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/chat/history', methods=['GET'])
def get_chat_history():
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute('SELECT id, title, created_at FROM chats ORDER BY created_at DESC')
    chats = [{'id': row[0], 'title': row[1], 'date': format_date(row[2])} for row in c.fetchall()]
    conn.close()
    return jsonify(chats)

@app.route('/api/chat/messages/<int:chat_id>', methods=['GET'])
def get_chat_messages(chat_id):
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute('SELECT role, content, timestamp FROM messages WHERE chat_id = ?', (chat_id,))
    messages = [{'role': row[0], 'content': row[1], 'timestamp': row[2]} for row in c.fetchall()]
    conn.close()
    return jsonify(messages)

@app.route('/api/chat/new', methods=['POST'])
def create_new_chat():
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute('INSERT INTO chats (title) VALUES (?)', ('New Chat',))
    chat_id = c.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'id': chat_id})

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        chat_id = data.get('chatId')
        
        # Store user message
        conn = sqlite3.connect('chat_history.db')
        c = conn.cursor()
        timestamp = datetime.now().strftime('%H:%M')
        c.execute('INSERT INTO messages (chat_id, role, content, timestamp) VALUES (?, ?, ?, ?)',
                 (chat_id, 'user', message, timestamp))
        
        # Get bot response
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {OPENROUTER_API_KEY}',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'StudyHive ChatBot'
            },
            json={
                'model': 'openai/gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a helpful AI assistant focused on helping students with their studies.'
                    },
                    {
                        'role': 'user',
                        'content': message
                    }
                ]
            }
        )
        
        data = response.json()
        bot_response = data['choices'][0]['message']['content']
        
        # Store bot response
        c.execute('INSERT INTO messages (chat_id, role, content, timestamp) VALUES (?, ?, ?, ?)',
                 (chat_id, 'assistant', bot_response, timestamp))
        
        # Update chat title if it's the first message
        c.execute('SELECT COUNT(*) FROM messages WHERE chat_id = ?', (chat_id,))
        if c.fetchone()[0] <= 2:  # First user message and bot response
            title = message[:30] + '...' if len(message) > 30 else message
            c.execute('UPDATE chats SET title = ? WHERE id = ?', (title, chat_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'response': bot_response})
        
    except Exception as e:
        print('Error:', str(e))
        return jsonify({'error': 'Something went wrong'}), 500

def format_date(date_str):
    date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
    today = datetime.now()
    if date.date() == today.date():
        return 'Today'
    elif (today.date() - date.date()).days <= 7:
        return 'Previous 7 Days'
    else:
        return 'Older'

if __name__ == '__main__':
    app.run(debug=True, port=5000) 