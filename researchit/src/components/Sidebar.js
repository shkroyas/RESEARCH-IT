
import { useState } from 'react';
import { FiHome, FiPlus, FiSearch, FiLogIn, FiUserPlus, FiChevronLeft, FiMenu } from 'react-icons/fi';
import image1 from '../assets/image1.png';
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      
<div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#FFFFFF] p-4 flex flex-col h-full fixed z-10 transition-all duration-300`}>

  <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'items-center justify-between'} mb-6 gap-2`}>
    <div className="flex items-center gap-2">
      <img
        src={image1}
        alt="ResearchAI Logo"
        className={`${isCollapsed ? 'w-12 h-12' : 'w-16 h-16'} object-contain`}
      />
      {!isCollapsed && <h1 className="text-xl font-medium text-[#D65600]">ResearchIt</h1>}
    </div>
    
    <button 
      className={`p-2 rounded-md text-[#D65600] hover:bg-[#D65600] hover:text-white transition-colors ${isCollapsed ? 'mt-2' : ''}`}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      {isCollapsed ? <FiMenu size={24} /> : <FiChevronLeft size={24} />}
    </button>
  </div>


        {/* Navigation Buttons */}
        <div className="mb-8 space-y-2">
          <button className="flex items-center gap-2 w-full p-3 rounded-lg bg-[#D65600] hover:bg-[#E56700] transition-colors justify-center">
            <FiPlus size={20} />
            {!isCollapsed && <span>New Chat</span>}
          </button>
          <button className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors justify-center">
            <FiHome size={20} />
            {!isCollapsed && <span>Home</span>}
          </button>
        </div>


        <div className="mt-auto space-y-2">
          <button className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors justify-center">
            <FiLogIn size={18} />
            {!isCollapsed && <span>Login</span>}
          </button>
          <button className="flex items-center gap-2 w-full p-3 rounded-lg bg-[#D65600] hover:bg-[#E56700] transition-colors justify-center">
            <FiUserPlus size={18} />
            {!isCollapsed && <span>Sign Up</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;