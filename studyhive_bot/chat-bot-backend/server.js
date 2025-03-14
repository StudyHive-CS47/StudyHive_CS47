const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for PDF upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Initialize OpenAI client with Azure configuration
const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN
});

// Store PDF content in memory (in a real app, you'd use a database)
let currentPdfContent = '';

app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    currentPdfContent = data.text;

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ 
      message: "PDF uploaded and processed successfully. You can now ask questions about the PDF content.",
      success: true 
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ 
      error: error.message || 'Error processing PDF',
      success: false 
    });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message, usePdf } = req.body;
    
    let systemMessage = "You are a helpful AI assistant focused on helping students with their studies.";
    
    // If in PDF mode and we have PDF content, include it in the context
    if (usePdf && currentPdfContent) {
      systemMessage += `\n\nYou have access to the following PDF content:\n${currentPdfContent}\n\nPlease use this content to answer questions when relevant.`;
    }
    
    console.log('Sending request to Azure OpenAI with message:', message);
    const response = await client.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: systemMessage
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    });

    console.log('Received response from Azure OpenAI:', JSON.stringify(response, null, 2));

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      console.error('Unexpected API response:', response);
      throw new Error('Invalid response format from API');
    }

    const botResponse = response.choices[0].message.content;
    console.log('Sending response to frontend:', botResponse);
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    res.status(500).json({ 
      error: error.message || 'Something went wrong',
      details: error.response?.data || 'No additional details available',
      status: error.response?.status
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    hasGitHubToken: !!process.env.GITHUB_TOKEN,
    tokenLength: process.env.GITHUB_TOKEN?.length,
    baseURL: "https://models.inference.ai.azure.com"
  });
}); 