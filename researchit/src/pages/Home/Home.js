import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import image1 from '../../assets/image1.png';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPaperclip, FiFilter } from 'react-icons/fi';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

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
const handleSearch=()=>{
    navigate('/signup');
}
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-[#FCDFCC] relative">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

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
                  placeholder="Search papers, ask research questions..."
                  className="flex-1 w-full px-4 sm:px-6 py-3 md:py-4 outline-none text-base md:text-lg"
                />
                <div className="flex items-center w-full sm:w-auto justify-end sm:justify-normal p-2 sm:p-0 sm:pr-4 space-x-2 sm:space-x-3">
                   
                  <button onClick={handleSearch} className="bg-[#D65600] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#E56700] transition-colors text-sm sm:text-base">
                    Search
                  </button>
                </div>
              </div>
              
              <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <button className="bg-white p-3 rounded-lg text-left hover:bg-gray-50 transition-colors text-sm md:text-base">
                  "What are the latest advancements in AI?"
                </button>
                <button className="bg-white p-3 rounded-lg text-left hover:bg-gray-50 transition-colors text-sm md:text-base">
                  "Show me papers about quantum computing"
                </button>
                <button className="bg-white p-3 rounded-lg text-left hover:bg-gray-50 transition-colors text-sm md:text-base">
                  "Compare neural network architectures"
                </button>
                <button className="bg-white p-3 rounded-lg text-left hover:bg-gray-50 transition-colors text-sm md:text-base">
                  "Upload PDF to analyze"
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;