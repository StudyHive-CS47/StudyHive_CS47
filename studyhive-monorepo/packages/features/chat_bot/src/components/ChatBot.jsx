import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import botAvatar from '../assets/bot-avatar.png';
import userAvatar from '../assets/user-avatar.png';
import Footer from '@shared/components/Footer/Footer';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "**WELCOME! I'M BUZZBUDDY**",
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

  // Get API key from environment variables
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

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
      content: "**WELCOME! I'M BUZZBUDDY**",
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

  // Add this new function to handle individual chat deletion
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

  // Modified getBotResponse to use OpenRouter API
  const getBotResponse = async (userMessage) => {
    try {
      setIsLoading(true);
      
      const API_URL = "https://openrouter.ai/api/v1/chat/completions";

      let systemPrompt = "";
      if (isPdfMode && pdfContent) {
        systemPrompt = `You are an AI assistant helping with questions about a PDF document. Here's the content of the PDF '${pdfName}':\n\n${pdfContent}\n\nPlease answer questions based on this content.`;
      } else {
        systemPrompt = "You are BuzzBuddy, a helpful and knowledgeable AI assistant focused on helping students with their studies. You provide clear, accurate, and engaging responses while maintaining a friendly and supportive tone.";
      }

      const response = await axios.post(
        API_URL,
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.slice(1).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://github.com/fdo-rashmina/StudyHive_Frontend',
            'X-Title': 'StudyHive BuzzBuddy',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        throw new Error('Invalid response format from API');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error in getBotResponse:', error);
      if (error.response?.data?.error?.message) {
        return `I apologize, but I encountered an error: ${error.response.data.error.message}. Please try again or contact support if the issue persists.`;
      }
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

      setPdfContent(extractedText); // We'll keep the same state variable name for simplicity
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
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat with proper structure
    const timestamp = new Date().toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp
    }]);

    try {
      const botResponse = await getBotResponse(userMessage);
      // Add bot response to chat with proper structure
      setMessages(prev => [...prev, {
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
      }]);
    } catch (error) {
      // Add error message to chat with proper structure
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error: " + error.message,
        timestamp: new Date().toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
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

  // Update the useEffect for scrolling
  useEffect(() => {
    if (messages.length > 0) {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Update the input handler to prevent scroll
  const handleInputChange = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

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

  return (
    <div className="flex flex-col h-screen bg-[#EEF4FE]">
      <div className="flex flex-1 gap-6 p-6 max-w-[1400px] mx-auto w-full h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-xl shadow-md flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-2">
              <button 
                onClick={startNewChat}
                className="flex-1 flex items-center justify-center gap-2 p-2.5 text-[#4051B5] border-2 border-[#4051B5] hover:bg-[#EEF4FE] rounded-lg transition-colors"
                title="Start New Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">New Chat</span>
              </button>
              <button 
                onClick={clearChatHistory}
                className="p-2.5 text-red-500 border-2 border-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear All History"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 p-4">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChat(chat)}
                  className={`p-3.5 rounded-lg cursor-pointer transition-all ${
                    selectedChat === chat.id 
                      ? 'bg-[#EEF4FE] text-[#1A237E] border border-[#4051B5]' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{chat.title}</span>
                      <span className="block text-xs text-gray-400">{chat.timestamp}</span>
                    </div>
                    {chat.isPdfMode && (
                      <span className="px-2 py-1 bg-[#EEF4FE] text-[#4051B5] rounded-md text-xs font-medium">DOC</span>
                    )}
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backup controls */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              <button
                onClick={exportChatHistory}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#EEF4FE] text-[#4051B5] rounded-lg hover:bg-[#E3E9FD] transition-colors font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export History
              </button>
              <button
                onClick={() => backupInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#4051B5] text-white rounded-lg hover:bg-[#1A237E] transition-colors font-medium"
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
                <div className="text-sm text-center text-[#4051B5]">
                  {backupStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-[#1A237E]">ChatBot</h1>
              <div className="flex items-center bg-[#EEF4FE] rounded-lg p-1">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !isPdfMode ? 'bg-white text-[#4051B5] shadow-sm' : 'text-gray-600 hover:text-[#1A237E]'
                  }`}
                  onClick={() => setIsPdfMode(false)}
                >
                  AI
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isPdfMode ? 'bg-white text-[#4051B5] shadow-sm' : 'text-gray-600 hover:text-[#1A237E]'
                  }`}
                  onClick={handleModeToggle}
                >
                  DOC
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-[#F8FAFF] messages-container" style={{ height: 'calc(100vh - 16rem)' }}>
            <div className="flex flex-col p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={message.role === 'user' ? userAvatar : botAvatar}
                        alt={`${message.role} avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-[#4051B5] text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{renderMessageContent(message.content)}</div>
                      <span className={`text-xs mt-1 block ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-center justify-center p-4">
                  <div className="w-2 h-2 rounded-full bg-[#4051B5] animate-bounce opacity-75" />
                  <div className="w-2 h-2 rounded-full bg-[#4051B5] animate-bounce [animation-delay:0.2s] opacity-75" />
                  <div className="w-2 h-2 rounded-full bg-[#4051B5] animate-bounce [animation-delay:0.4s] opacity-75" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-100 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={isPdfMode ? "Ask questions about the document..." : "Message BuzzBuddy..."}
                className="flex-grow p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4051B5] focus:ring-1 focus:ring-[#4051B5] bg-[#F8FAFF]"
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
                className="p-3 bg-[#EEF4FE] text-[#4051B5] rounded-xl hover:bg-[#E3E9FD] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 bg-[#4051B5] text-white rounded-xl hover:bg-[#1A237E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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