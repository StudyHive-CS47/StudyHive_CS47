from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime
import PyPDF2
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)

# Set up OpenAI client with GitHub configuration
GITHUB_TOKEN = "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"
client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=GITHUB_TOKEN,
)

print(f"GitHub Token loaded: {'✓' if GITHUB_TOKEN else '✗'}")

class PDFChatbot:
    def __init__(self):
        self.pdf_content = {}
        self.active_pdf = None

    def load_pdf(self, pdf_file):
        try:
            pdf_name = os.path.basename(pdf_file.filename)
            reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            
            self.pdf_content[pdf_name] = text
            self.active_pdf = pdf_name
            return True, f"PDF '{pdf_name}' loaded successfully"
        except Exception as e:
            return False, str(e)

    def answer_pdf_question(self, question):
        if not self.active_pdf:
            return "No PDF is currently active. Please load a PDF first."
        
        if self.active_pdf not in self.pdf_content:
            return f"PDF '{self.active_pdf}' not found in memory. Please reload it."
        
        try:
            context = self.pdf_content[self.active_pdf]
            
            # Use GitHub model to answer questions about the PDF
            response = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant analyzing a PDF document."},
                    {"role": "user", "content": f"Based on the following text, {question}\n\nText: {context[:4000]}"}  # Limit context to 4000 chars
                ],
                model="gpt-4o",
                temperature=0.7,
                max_tokens=500,
                top_p=1
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Error processing question: {str(e)}"

# Initialize PDF chatbot
pdf_bot = PDFChatbot()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        use_pdf = data.get('usePdf', False)
        
        print(f"Received message: {message}")
        print(f"PDF mode: {use_pdf}")
        
        if not GITHUB_TOKEN:
            error_msg = "GitHub token not set. Please check your configuration."
            print(error_msg)
            return jsonify({'error': error_msg}), 401
        
        if use_pdf:
            response_text = pdf_bot.answer_pdf_question(message)
        else:
            try:
                print("Sending request to model...")
                response = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": "You are BuzzBuddy, a helpful AI assistant focused on helping students with their studies."},
                        {"role": "user", "content": message}
                    ],
                    model="gpt-4o",
                    temperature=0.7,
                    max_tokens=500,
                    top_p=1
                )
                
                response_text = response.choices[0].message.content
                print(f"Model response received: {response_text[:100]}...")
                
            except Exception as api_error:
                error_msg = f"API Error: {str(api_error)}"
                print(error_msg)
                return jsonify({'error': error_msg}), 500
        
        return jsonify({'response': response_text})
        
    except Exception as e:
        error_msg = f"Error in chat endpoint: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/api/upload-pdf', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'File must be a PDF'}), 400
    
    success, message = pdf_bot.load_pdf(file)
    if success:
        return jsonify({'message': message})
    else:
        return jsonify({'error': message}), 400

@app.route('/api/status', methods=['GET'])
def status():
    pdf_status = {
        'active_pdf': pdf_bot.active_pdf,
        'loaded_pdfs': list(pdf_bot.pdf_content.keys())
    }
    return jsonify({'status': 'ok', 'pdf_status': pdf_status})

if __name__ == '__main__':
    # Make sure your OpenAI API key is set
    if not GITHUB_TOKEN:
        print("WARNING: GITHUB_TOKEN is not set!")
        print("The chatbot will not work without a valid API key.")
    
    app.run(debug=True, port=5000)