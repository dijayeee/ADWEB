import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginBG from './Assets/LoginBG.jpg';
import HeaderLog from './Components/HeaderLog';
import { useAuth } from './Context/AuthContext';
import HelpModal from './Components/HelpModal';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        if (formData.username === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setError(result.error || 'Invalid username or password');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LoginBG})`, filter: 'brightness(0.7)' }}
      ></div>

      <HeaderLog />

      <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-10 md:gap-0 px-4 sm:px-6 md:px-12 py-8">
        <div className="text-white max-w-xl text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4">WearHaus</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 sm:text-gray-300">Simplicity In Every Thread.</p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-sm mx-auto md:mx-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forget Password
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="w-full text-center text-gray-600 hover:text-gray-900 text-sm mt-4"
            >
              Need help? Click here
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">Don't have an account?</p>
              <Link to="/signup" className="inline-block bg-black text-white px-8 py-2 rounded font-semibold hover:bg-gray-800 transition">
                Sign up
              </Link>
            </div>
          </form>
        </div>

        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </div>
    </div>
  );
}

export default LoginPage;