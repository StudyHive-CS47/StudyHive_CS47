from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

app = Flask(__name__)
CORS(app)


template = """
Answer the question below.

Here is the conversation history: {context}

Question: {question}

Answer:
"""

model = OllamaLLM(model="llama3")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model


conversation_context = ""

@app.route('/chat', methods=['POST'])
def chat():
    global conversation_context
    try:
        data = request.json
        user_message = data.get('message')
        
        
        result = chain.invoke({
            "context": conversation_context, 
            "question": user_message
        })
        
        
        conversation_context += f"\nUser: {user_message}\nAI: {result}"
        
        return jsonify({'response': result})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True) 