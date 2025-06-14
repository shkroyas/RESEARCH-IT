import { useState } from 'react';
import useAuthTokens from '../Token';
import Sidebar from '../../components/Sidebar';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { accessToken, refreshToken } = useAuthTokens(formData.email, formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      setSuccess(true);
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#FCDFCC]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#3A3A3A] mb-6 text-center">Create Your Account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Account created successfully! You can now log in.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullname" className="block text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D65600]"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D65600]"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D65600]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#D65600] text-white py-2 px-4 rounded-md hover:bg-[#E56700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D65600] focus:ring-offset-2"
            >
              Sign Up
            </button>

            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#D65600] hover:underline">
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;