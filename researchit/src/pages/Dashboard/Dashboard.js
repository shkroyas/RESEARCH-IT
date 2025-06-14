import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import image1 from '../../assets/image1.png';
import { FiSearch, FiPaperclip, FiFilter, FiExternalLink, FiX } from 'react-icons/fi';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [researchResults, setResearchResults] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [showTermPanel, setShowTermPanel] = useState(false);
  const [termSearchResults, setTermSearchResults] = useState([]);

  // Mock research paper search
  const searchResearchPapers = (query) => {
    const mockPapers = [
      {
        id: 1,
        title: `Research on ${query}`,
        content: `This paper examines the ${query} phenomenon in modern contexts. The ${query} theory suggests... Many scholars debate the ${query} applications.`,
        authors: "Smith et al."
      },
      {
        id: 2,
        title: `Advanced studies in ${query}`,
        content: `Recent developments in ${query} have revolutionized our understanding. The ${query} framework provides new insights...`,
        authors: "Johnson & Lee"
      }
    ];
    setResearchResults(mockPapers);
  };

  // Handle text selection from research papers
  const handleTextSelect = () => {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 0 && selection.split(' ').length <= 3) {
      setSelectedTerm(selection);
      setShowTermPanel(true);
    }
  };

  // Mock term search
  const searchSelectedTerm = (term) => {
    const mockTermResults = [
      {
        title: `Definition of ${term}`,
        url: `https://www.google.com/search?q=definition+of+${encodeURIComponent(term)}`,
        description: `Learn what ${term} means`
      },
      {
        title: `${term} in research`,
        url: `https://scholar.google.com/scholar?q=${encodeURIComponent(term)}`,
        description: `Academic papers about ${term}`
      },
      {
        title: `${term} explained`,
        url: `https://www.google.com/search?q=${encodeURIComponent(term)}+explained`,
        description: `Simple explanations of ${term}`
      }
    ];
    setTermSearchResults(mockTermResults);
  };

  useEffect(() => {
    if (selectedTerm) {
      searchSelectedTerm(selectedTerm);
    }
  }, [selectedTerm]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="flex h-screen bg-[#FCDFCC] relative">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Term Search Panel */}
      {showTermPanel && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-20 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Search: "{selectedTerm}"</h2>
            <button 
              onClick={() => setShowTermPanel(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="space-y-3">
            {termSearchResults.map((result, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="font-medium text-[#D65600]">{result.title}</h3>
                  <p className="text-sm text-gray-600">{result.description}</p>
                  <FiExternalLink className="inline-block ml-1 text-gray-400" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col items-center pt-10 md:pt-24 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16 md:ml-20' : 'ml-64'
      }`}>
        <div className="text-center w-full max-w-4xl px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <img
                src={image1}
                alt="ResearchAI Logo"
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
              <h1 className="text-xl md:text-2xl font-medium text-[#3A3A3A]">ResearchIt</h1>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-800 md:-mt-6 mb-8 md:mb-12">
              Accelerate your Research Journey
            </p>
            
            <div className="w-full mb-6 md:mb-8">
              <div className="relative flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden focus-within:ring-2 focus-within:ring-[#D65600] focus-within:border-transparent">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search research papers..."
                  className="flex-1 w-full px-4 sm:px-6 py-3 md:py-4 outline-none text-base md:text-lg"
                />
                <div className="flex items-center w-full sm:w-auto justify-end sm:justify-normal p-2 sm:p-0 sm:pr-4 space-x-2 sm:space-x-3">
                  <button 
                    className="p-2 text-gray-500 hover:text-[#D65600] hover:bg-gray-100 rounded-full"
                    title="Upload PDF"
                  >
                    <FiPaperclip size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-[#D65600] hover:bg-gray-100 rounded-full"
                    title="Filters"
                  >
                    <FiFilter size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    onClick={() => searchResearchPapers(searchQuery)}
                    className="bg-[#D65600] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#E56700] transition-colors text-sm sm:text-base"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Research Results */}
              {researchResults.length > 0 && (
                <div 
                  className="mt-6 space-y-4" 
                  onMouseUp={handleTextSelect}
                >
                  {researchResults.map(paper => (
                    <div key={paper.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-bold text-[#D65600]">{paper.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">By {paper.authors}</p>
                      <p className="text-gray-800">{paper.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <button 
                  onClick={() => {
                    setSearchQuery('machine learning');
                    searchResearchPapers('machine learning');
                  }}
                  className="bg-white p-3 rounded-lg text-left hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  "Machine learning papers"
                </button>
                <button 
                  onClick={() => {
                    setSearchQuery('quantum physics');
                    searchResearchPapers('quantum physics');
                  }}
                  className="bg-white p-3 rounded-lg text-left hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  "Quantum physics research"
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;