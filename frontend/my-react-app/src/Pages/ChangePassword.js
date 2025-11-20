import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useAuth } from '../Context/AuthContext';
import api from '../config/axios';
import { User as UserIcon } from 'lucide-react';

function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('change-password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (location.pathname === '/change-password') {
      setActiveTab('change-password');
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/users/change-password/${authUser?.username}`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setSuccess('Password changed successfully');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(response.data.error || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.error || err.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{authUser?.username || 'User'}</p>
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-xs text-black hover:text-gray-500"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-black uppercase mb-2">My Account</p>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate('/address')}
                  className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Address
                </button>
                <button
                  onClick={() => navigate('/change-password')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'change-password'
                      ? 'bg-black text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Change Password
                </button>
              </div>

              <div className="mt-6 pt-6 border-t space-y-1">
                <p className="text-xs font-semibold text-black uppercase mb-2">My Purchase</p>
                <button
                  onClick={() => navigate('/my-purchase')}
                  className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  My Orders
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
              <p className="text-gray-600 mb-6">Update your password to keep your account secure</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ChangePassword;

