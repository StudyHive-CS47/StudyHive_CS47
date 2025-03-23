import React, { useState, useRef, useEffect } from 'react';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import mammoth from 'mammoth';
import botAvatar from '../assets/bot-avatar.png';
import userAvatar from '../assets/user-avatar.png';
import Footer from './Footer';
import Header from './Header';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "**WELCOME TO BUZZBUDDY**",
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [selectedChat, setSelectedChat] = useState(null);
  const [hasPdfLoaded, setHasPdfLoaded] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Add new state for backup status
  const [backupStatus, setBackupStatus] = useState('');
  const backupInputRef = useRef(null);

  // Function to group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(msg => {
      const date = msg.timestamp.split(' ')[0]; // Get just the date part
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  // Function to extract text from Word document
  const extractTextFromDoc = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (!result.value) {
        throw new Error('No text content found in document');
      }

      return result.value.trim();
    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw new Error(`Failed to extract text from document: ${error.message}`);
    }
  };

  // Function to save current chat to history
  const saveToHistory = () => {
    if (messages.length > 1) {
      const newChat = {
        id: Date.now(),
        title: messages[1].content.substring(0, 30) + "...",
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        messages: [...messages],
        isPdfMode: isPdfMode,
        hasPdfLoaded: hasPdfLoaded,
        pdfContent: pdfContent,
        pdfName: pdfName
      };
      setChatHistory(prev => [newChat, ...prev]);
    }
  };

  // Function to start new chat
  const startNewChat = () => {
    saveToHistory();
    setMessages([{
      role: 'assistant',
      content: "**WELCOME TO BUZZBUDDY**",
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }]);
    setSelectedChat(null);
    setIsPdfMode(false);
  };

  // Function to load a chat from history
  const loadChat = (chat) => {
    setMessages(chat.messages);
    setSelectedChat(chat.id);
    setIsPdfMode(chat.isPdfMode || false);
    setHasPdfLoaded(chat.hasPdfLoaded || false);
    setPdfContent(chat.pdfContent || '');
    setPdfName(chat.pdfName || '');
  };

  // Add a function to clear chat history
  const clearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      localStorage.removeItem('chatHistory');
      setChatHistory([]);
    }
  };

  // Function to handle individual chat deletion
  const deleteChat = (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    if (window.confirm('Are you sure you want to delete this chat?')) {
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      if (selectedChat === chatId) {
        setSelectedChat(null);
        startNewChat();
      }
    }
  };

  const formatBotResponse = (text) => {
    // Handle bullet points and numbered lists
    text = text.replace(/•/g, '\n•');
    text = text.replace(/(\d+\.\s)/g, '\n$1');

    // Handle code blocks
    text = text.replace(/```(.*?)```/gs, (match) => `\n${match}\n`);

    // Add spacing after punctuation
    text = text.replace(/([.!?])\s*/g, '$1\n\n');

    // Remove extra newlines
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
  };

  // Modified getBotResponse to include PDF context when in PDF mode
  const getBotResponse = async (userMessage) => {
    try {
      setIsLoading(true);
      
      const client = ModelClient(
        "https://models.inference.ai.azure.com",
        new AzureKeyCredential(import.meta.env.VITE_GITHUB_TOKEN)
      );

      let systemPrompt = "";
      if (isPdfMode && pdfContent) {
        systemPrompt = `You are an AI assistant helping with questions about a PDF document. Here's the content of the PDF '${pdfName}':\n\n${pdfContent}\n\nPlease answer questions based on this content.`;
      }

      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage }
          ],
          model: "gpt-4o",
          temperature: 1,
          max_tokens: 4096,
          top_p: 1
        }
      });

      if (isUnexpected(response)) {
        throw response.body.error;
      }

      return response.body.choices[0].message.content;
    } catch (error) {
      console.error('Error in getBotResponse:', error);
      return `I apologize, but I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`;
    } finally {
      setIsLoading(false);
    }
  };

  // Modified handleFileChange to handle Word documents
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      alert('Please upload a Word document (.docx)');
      return;
    }

    try {
      setIsLoading(true);
      const extractedText = await extractTextFromDoc(file);
      
      if (!extractedText) {
        throw new Error('No text could be extracted from the document');
      }

      setPdfContent(extractedText);
      setPdfName(file.name);
      setHasPdfLoaded(true);
      setIsPdfMode(true);

      const botMessage = {
        role: 'assistant',
        content: `Document "${file.name}" has been loaded successfully. You can now ask questions about its content.`,
        timestamp: new Date().toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing document:', error);
      const errorMessage = {
        role: 'assistant',
        content: `Error processing document: ${error.message}. Please make sure the file is a valid Word document and try again.`,
        timestamp: new Date().toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botResponse = await getBotResponse(input);
    const botMessage = {
      role: 'assistant',
      content: botResponse,
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleModeToggle = () => {
    if (!hasPdfLoaded && !isPdfMode) {
      alert('Please upload a PDF file first');
      return;
    }
    setIsPdfMode(!isPdfMode);
  };

  // Handle file input click
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update message content rendering
  const renderMessageContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.trim().startsWith('```')) {
        return (
          <pre key={index} className="code-block">
            <code>{line.replace(/```/g, '').trim()}</code>
          </pre>
        );
      } else if (line.trim().startsWith('•')) {
        return <li key={index} className="bullet-point">{formatTextWithBold(line.trim())}</li>;
      } else if (line.trim().match(/^\d+\./)) {
        return <li key={index} className="numbered-list">{formatTextWithBold(line.trim())}</li>;
      } else {
        return <p key={index} className="text-line">{formatTextWithBold(line)}</p>;
      }
    });
  };

  // Update the formatTextWithBold function
  const formatTextWithBold = (text) => {
    // Split by pairs of asterisks
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove double asterisks and wrap in bold tag
        return <strong key={index} className="bold-text">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Enhanced function to save chat history to localStorage
  const saveToLocalStorage = (history) => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(history));
      console.log('Chat history saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Function to export chat history to a file
  const exportChatHistory = () => {
    try {
      const historyData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        history: chatHistory
      };
      
      const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setBackupStatus('Chat history exported successfully!');
      setTimeout(() => setBackupStatus(''), 3000);
    } catch (error) {
      console.error('Error exporting chat history:', error);
      setBackupStatus('Error exporting chat history');
      setTimeout(() => setBackupStatus(''), 3000);
    }
  };

  // Function to import chat history from a file
  const importChatHistory = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate the imported data
      if (!importedData.version || !importedData.history) {
        throw new Error('Invalid chat history file format');
      }

      // Merge with existing history, removing duplicates by ID
      const mergedHistory = [...chatHistory];
      importedData.history.forEach(importedChat => {
        const existingIndex = mergedHistory.findIndex(chat => chat.id === importedChat.id);
        if (existingIndex === -1) {
          mergedHistory.push(importedChat);
        }
      });

      // Sort by timestamp, newest first
      mergedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setChatHistory(mergedHistory);
      setBackupStatus('Chat history imported successfully!');
      setTimeout(() => setBackupStatus(''), 3000);
    } catch (error) {
      console.error('Error importing chat history:', error);
      setBackupStatus('Error importing chat history');
      setTimeout(() => setBackupStatus(''), 3000);
    }
    event.target.value = ''; // Reset file input
  };

  // Auto-save to localStorage whenever chat history changes
  useEffect(() => {
    saveToLocalStorage(chatHistory);
  }, [chatHistory]);

  // Load chat history from localStorage on initial load
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
        console.log('Chat history loaded from localStorage');
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  // Add backup controls to the sidebar
  const renderBackupControls = () => (
    <div className="p-4 border-t border-gray-200">
      <div className="flex flex-col gap-2">
        <button
          onClick={exportChatHistory}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-700 rounded-lg hover:from-blue-300 hover:to-blue-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export History
        </button>
        <button
          onClick={() => backupInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Import History
        </button>
        <input
          type="file"
          ref={backupInputRef}
          onChange={importChatHistory}
          accept=".json"
          className="hidden"
        />
        {backupStatus && (
          <div className="text-sm text-center text-gray-600">
            {backupStatus}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 gap-4 p-4 max-w-[1400px] mx-auto w-full">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex gap-2">
              <button 
                onClick={startNewChat}
                className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-500 border-2 border-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Start New Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>New Chat</span>
              </button>
              <button 
                onClick={clearChatHistory}
                className="p-2 text-red-500 border-2 border-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear All History"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChat(chat)}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedChat === chat.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{chat.title}</span>
                      <span className="block text-xs text-gray-400">{chat.timestamp}</span>
                    </div>
                    {chat.isPdfMode && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs">DOC</span>
                    )}
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add backup controls */}
          {renderBackupControls()}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">
                ChatBot
              </h1>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    !isPdfMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setIsPdfMode(false)}
                >
                  AI
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    isPdfMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={handleModeToggle}
                >
                  DOC
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={message.role === 'user' ? userAvatar : botAvatar}
                      alt={`${message.role} avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{renderMessageContent(message.content)}</div>
                    <span className={`text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-gray-400 p-4">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isPdfMode ? "Ask questions about the document..." : "Message BuzzBuddy..."}
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatBot; 
