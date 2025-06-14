import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiHome, FiPlus, FiSearch, FiLogIn, FiUserPlus, FiChevronLeft, FiMenu,FiUser } from 'react-icons/fi';
import image1 from '../assets/image1.png';
import { useEffect } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const isLoggedIn = () => !!localStorage.getItem('accessToken');

  const handleSignup = () => navigate('/signup');
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };
  useEffect(() => {
    if (isLoggedIn()) {
      const fetchProfile = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/users/profile/', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
      fetchProfile();
    }
  }, []);

  const handleHome = () => navigate(isLoggedIn() ? '/dashboard' : '/');
  const handleDashboard = () => navigate(isLoggedIn() ? '/dashboard' : '/');
  const handleLogin = () => navigate('/login');
  const handleNewChat = () => navigate(isLoggedIn() ? '/new-chat' : '/login');

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white p-4 flex flex-col h-full fixed z-10 transition-all duration-300`}>
      <div 
        className={`flex ${isCollapsed ? 'flex-col items-center' : 'items-center justify-between'} mb-6 gap-2 cursor-pointer`}
        onClick={handleDashboard}
      >
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
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
        >
          {isCollapsed ? <FiMenu size={24} /> : <FiChevronLeft size={24} />}
        </button>
      </div>

      <div className="mb-8 space-y-2">
        <button 
          onClick={handleNewChat}
          className="flex items-center gap-2 w-full p-3 rounded-lg bg-[#D65600] text-white hover:bg-[#E56700] transition-colors justify-center"
        >
          <FiPlus size={20} />
          {!isCollapsed && <span>New Chat</span>}
        </button>
        <button 
          onClick={handleHome}
          className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors justify-center"
        >
          <FiHome size={20} />
          {!isCollapsed && <span>Home</span>}
        </button>
      </div>

      {!isLoggedIn() ? (
  <div className="mt-auto space-y-2">
    <button 
      onClick={handleLogin} 
      className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors justify-center"
    >
      <FiLogIn size={18} />
      {!isCollapsed && <span>Login</span>}
    </button>
    <button 
      onClick={handleSignup} 
      className="flex items-center gap-2 w-full p-3 rounded-lg bg-[#D65600] text-white hover:bg-[#E56700] transition-colors justify-center"
    >
      <FiUserPlus size={18} />
      {!isCollapsed && <span>Sign Up</span>}
    </button>
  </div>
) : (
  <div className="mt-auto space-y-2">
    {/* Profile section added here */}
    {userData && (
      <div className="mb-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D65600] text-white rounded-full">
            <FiUser size={18} />
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium">{userData.fullname || 'User'}</p>
              <p className="text-sm text-gray-500 truncate">{userData.email}</p>
            </div>
          )}
        </div>
      </div>
    )}
    <button 
      onClick={handleLogout} 
      className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors justify-center"
    >
      <FiLogIn size={18} />
      {!isCollapsed && <span>Logout</span>}
    </button>
  </div>
  )}
</div>
);
}

export default Sidebar;