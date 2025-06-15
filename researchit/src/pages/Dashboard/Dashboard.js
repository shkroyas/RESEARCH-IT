import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import image1 from '../../assets/image1.png';
import { FiSearch, FiSend, FiExternalLink, FiX, FiCopy } from 'react-icons/fi';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [showTermPanel, setShowTermPanel] = useState(false);
  const [termSearchResults, setTermSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize with a new conversation
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: "New Conversation",
      messages: [{
        id: 1,
        text: "Hello! I'm your research assistant. What would you like to search for today?",
        sender: 'bot',
        timestamp: new Date()
      }]
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation.messages);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  };

  // Citation formatting functions
  const formatCitation = {
    apa: (metadata) => {
      if (!metadata || !metadata.authors || !metadata.published) {
        return `arXiv:${metadata?.arxiv_id || 'unknown'} [citation data incomplete]`;
      }
      
      const authors = metadata.authors.map(author => {
        const parts = author.split(' ');
        const lastName = parts.pop();
        const initials = parts.map(part => `${part[0]}.`).join(' ');
        return `${lastName}, ${initials}`;
      }).join(', ');

      const year = new Date(metadata.published).getFullYear();
      const title = metadata.title.replace(/\n/g, ' ').trim();
      
      return `${authors} (${year}). ${title}. arXiv preprint ${metadata.arxiv_id}.`;
    },

    ieee: (metadata) => {
      if (!metadata || !metadata.authors || !metadata.published) {
        return `arXiv:${metadata?.arxiv_id || 'unknown'} [citation data incomplete]`;
      }
      
      const authors = metadata.authors.map(author => {
        const parts = author.split(' ');
        const lastName = parts.pop();
        const initials = parts.map(part => `${part[0]}.`).join(' ');
        return `${initials} ${lastName}`;
      }).join(', ');

      const year = new Date(metadata.published).getFullYear();
      const title = metadata.title.replace(/\n/g, ' ').trim();
      
      return `${authors}, "${title}," arXiv preprint ${metadata.arxiv_id}, ${year}.`;
    }
  };

  // Process all metadata entries into citation objects
  const generateAllCitations = (metadataList, summaryData) => {
    return metadataList.map(metadata => {
      // Find matching summary data if it exists
      const summaryKey = `output\\data\\pdf\\${metadata.arxiv_id}.pdf`;
      const summary = summaryData[summaryKey] || null;
      
      return {
        id: metadata.arxiv_id,
        title: metadata.title,
        authors: metadata.authors,
        published: metadata.published,
        citations: {
          apa: formatCitation.apa(metadata),
          ieee: formatCitation.ieee(metadata)
        },
        pdfUrl: `https://arxiv.org/pdf/${metadata.arxiv_id}.pdf`,
        summary: summary
      };
    });
  };

  const searchResearchPapers = async (query) => {
    if (!query.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: query,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update current conversation
    const updatedMessages = [...currentConversation, userMessage];
    setCurrentConversation(updatedMessages);
    updateConversationHistory(updatedMessages, query);
    
    // Add loading message
    const loadingMessage = {
      id: Date.now() + 1,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      loading: true
    };
    setCurrentConversation(prev => [...prev, loadingMessage]);
    
    setIsLoading(true);
    
    let timeoutTriggered = false;
    const loadingMessageId = loadingMessage.id;
    
    // Set timeout for long request notification
    timeoutRef.current = setTimeout(() => {
      timeoutTriggered = true;
      const notificationMessage = {
        id: Date.now() + 1.5,
        text: "This is taking longer than expected. We'll notify you when it's ready.",
        sender: 'bot',
        timestamp: new Date()
      };
      setCurrentConversation(prev => [
        ...prev.filter(m => m.id !== loadingMessageId),
        notificationMessage
      ]);
    }, 20000);

    try {
      const response = await fetch(`http://127.0.0.1:8000/output/search/?query=${encodeURIComponent(query)}`);
      
      // Clear the timeout if request completes
      clearTimeout(timeoutRef.current);
      
      if (!response.ok) {
        throw new Error('Failed to fetch research papers');
      }

      const responseData = await response.json();
      
      // Generate citations for all papers in metadata
      const allCitations = generateAllCitations(responseData.metadata_list || [], responseData.summary_data || {});

      // Create bot response message
      const botMessage = {
        id: Date.now() + 2,
        text: "Here are all available papers with their citations:",
        sender: 'bot',
        timestamp: new Date(),
        citations: allCitations
      };

      // Build final messages array
      let finalMessages;
      if (timeoutTriggered) {
        finalMessages = [
          ...updatedMessages,
          {
            id: Date.now() + 1.5,
            text: "This is taking longer than expected. We'll notify you when it's ready.",
            sender: 'bot',
            timestamp: new Date()
          },
          botMessage
        ];
      } else {
        finalMessages = [...updatedMessages, botMessage];
      }
      
      setCurrentConversation(finalMessages);
      updateConversationHistory(finalMessages, query);
      
      if (timeoutTriggered) {
        toast.success('Your research results have arrived!', {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      clearTimeout(timeoutRef.current);
      
      const errorMessage = {
        id: Date.now() + 2,
        text: err.message.includes('timeout') 
          ? "The request timed out. Please try again." 
          : "Sorry, I couldn't fetch the research papers. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      const finalMessages = [
        ...updatedMessages,
        ...(timeoutTriggered ? [{
          id: Date.now() + 1.5,
          text: "This is taking longer than expected. We'll notify you when it's ready.",
          sender: 'bot',
          timestamp: new Date()
        }] : []),
        errorMessage
      ];
      
      setCurrentConversation(finalMessages);
      updateConversationHistory(finalMessages, query);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationHistory = (messages, query) => {
    if (!activeConversationId) return;
    
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId
        ? {
            ...conv,
            messages: messages,
            title: query || conv.title
          }
        : conv
    ));
  };

  const selectConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation.messages);
      setActiveConversationId(conversationId);
      setShowTermPanel(false);
    }
  };

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleTextSelect = () => {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 0 && selection.split(' ').length <= 3) {
      setSelectedTerm(selection);
      setShowTermPanel(true);
      searchSelectedTerm(selection);
    }
  };

  const searchSelectedTerm = async (term) => {
    setIsLoading(true);
    try {
      const mockTermResults = [
        {
          title: `Definition of ${term}`,
          url: `#`,
          description: `Learn what ${term} means`,
          action: () => window.open(`https://www.google.com/search?q=definition+of+${encodeURIComponent(term)}`, '_blank')
        },
        {
          title: `${term} in research`,
          url: `#`,
          description: `Academic papers about ${term}`,
          action: () => window.open(`https://scholar.google.com/scholar?q=${encodeURIComponent(term)}`, '_blank')
        },
        {
          title: `${term} explained`,
          url: `#`,
          description: `Simple explanations of ${term}`,
          action: () => window.open(`https://www.google.com/search?q=${encodeURIComponent(term)}+explained`, '_blank')
        }
      ];
      setTermSearchResults(mockTermResults);
    } catch (error) {
      console.error('Error searching term:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdownSection = (title, content) => {
    if (!content) return null;
    
    const htmlContent = content
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="font-semibold mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    
    return (
      <div className="mb-4">
        {title && <h4 className="font-semibold mb-2">{title}</h4>}
        <div 
          className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: `<p>${htmlContent}</p>` }}
        />
      </div>
    );
  };

  const renderMessageContent = (message) => {
    if (message.loading) {
      return (
        <div className="flex space-x-2 py-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      );
    }
    
    if (message.citations) {
      return (
        <div className="space-y-6">
          {message.text && <p className="text-gray-700">{message.text}</p>}
          {message.citations.map((paper) => (
            <div key={paper.id} className="bg-[#f8f9fa] p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold">{paper.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {paper.authors.join(', ')} • {new Date(paper.published).toLocaleDateString()}
              </p>
              
              <div className="flex items-center space-x-4 mb-4">
                <a 
                  href={paper.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#D65600] hover:underline text-sm flex items-center"
                >
                  <FiExternalLink className="mr-1" /> View PDF
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <h4 className="font-semibold text-sm mb-1">APA Citation</h4>
                  <p className="text-xs text-gray-700">{paper.citations.apa}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(paper.citations.apa);
                      toast.success('APA citation copied!');
                    }}
                    className="mt-2 text-xs text-[#D65600] hover:underline flex items-center"
                  >
                    <FiCopy className="mr-1" size={12} /> Copy
                  </button>
                </div>

                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <h4 className="font-semibold text-sm mb-1">IEEE Citation</h4>
                  <p className="text-xs text-gray-700">{paper.citations.ieee}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(paper.citations.ieee);
                      toast.success('IEEE citation copied!');
                    }}
                    className="mt-2 text-xs text-[#D65600] hover:underline flex items-center"
                  >
                    <FiCopy className="mr-1" size={12} /> Copy
                  </button>
                </div>
              </div>

              {paper.summary && (
                <>
                  {renderMarkdownSection("Overview", paper.summary.overview)}
                  {renderMarkdownSection("Key Findings", paper.summary.key_findings)}
                  {renderMarkdownSection("Methodologies", paper.summary.methodologies)}
                  {renderMarkdownSection("Recommendations", paper.summary.recommendations)}
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return <p>{message.text}</p>;
  };

  return (
    <div className="flex h-screen bg-white relative">
      <ToastContainer />
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        conversations={conversations}
        activeConversationId={activeConversationId}
        selectConversation={selectConversation}
        createNewConversation={handleNewChat}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16 md:ml-20' : 'ml-64'
      }`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img src={image1} alt="ResearchAI Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-lg font-medium text-gray-800">ResearchIt</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-white" onMouseUp={handleTextSelect}>
          <div className="max-w-3xl mx-auto space-y-6">
            {currentConversation.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.sender === 'user' 
                      ? 'bg-[#D65600] text-white' 
                      : 'bg-[#f8f9fa] text-gray-800 border border-gray-200'
                  }`}
                >
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-[#f8f9fa] rounded-lg border border-gray-300 focus-within:border-[#D65600]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && searchResearchPapers(searchQuery)}
                placeholder="Message ResearchIt..."
                className="flex-1 w-full px-4 py-3 outline-none bg-transparent"
                disabled={isLoading}
              />
              <button 
                onClick={() => !isLoading && searchResearchPapers(searchQuery)}
                disabled={isLoading || !searchQuery.trim()}
                className="p-2 text-[#D65600] hover:text-[#E56700] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#D65600] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSend size={20} />
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              ResearchIt can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>

      {showTermPanel && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-20 border-l border-gray-200 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Search: "{selectedTerm}"</h2>
            <button onClick={() => setShowTermPanel(false)} className="p-1 rounded-full hover:bg-gray-100">
              <FiX size={20} />
            </button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-[#D65600] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {termSearchResults.map((result, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <button onClick={result.action} className="w-full text-left">
                    <h3 className="font-medium text-[#D65600]">{result.title}</h3>
                    <p className="text-sm text-gray-600">{result.description}</p>
                    <FiExternalLink className="inline-block ml-1 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;