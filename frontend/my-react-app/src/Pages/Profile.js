import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useAuth } from '../Context/AuthContext';
import api from '../config/axios';
import { User as UserIcon, Image as ImageIcon } from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    profileImage: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/profile/${authUser?.username}`);
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          username: userData.username || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          gender: userData.gender || 'Male',
          profileImage: userData.profileImage || ''
        });
        setImagePreview(userData.profileImage || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [authUser?.username]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    // Set active tab based on route
    if (location.pathname === '/profile') {
      setActiveTab('profile');
    } else if (location.pathname === '/address') {
      setActiveTab('address');
    } else if (location.pathname === '/change-password') {
      setActiveTab('change-password');
    }
  }, [location.pathname]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setError('Image size must be less than 1MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData);

      if (response.data.success) {
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        const imageUrl = `${baseUrl}${response.data.imageUrl}`;
        setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
        setImagePreview(imageUrl);
      } else {
        setError(response.data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.error || err.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await api.put(`/users/profile/${authUser?.username}`, formData);

      if (response.data.success) {
        setSuccess('Profile updated successfully');
        await fetchUserProfile();
      } else {
        setError(response.data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    const masked = local.substring(0, 2) + '*'.repeat(local.length - 2);
    return `${masked}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    if (phone.length <= 2) return phone;
    return '*'.repeat(phone.length - 2) + phone.slice(-2);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.username || 'User'}</p>
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-xs text-black hover:text-black"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-black uppercase mb-2">My Account</p>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    navigate('/profile');
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'profile'
                      ? 'bg-black text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActiveTab('address');
                    navigate('/address');
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'address'
                      ? 'bg-black-50 text-white-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Address
                </button>
                <button
                  onClick={() => {
                    setActiveTab('change-password');
                    navigate('/change-password');
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'change-password'
                      ? 'bg-black-50 text-white-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Change Password
                </button>
              </div>

              <div className="mt-6 pt-6 border-t space-y-1">
                <p className="text-xs font-semibold text-black uppercase mb-2">My Purchase</p>
                <button
                  onClick={() => {
                    setActiveTab('my-purchase');
                    navigate('/my-purchase');
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'my-purchase'
                      ? 'bg-black-50 text-white-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Orders
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600 mb-6">Manage and protect your account</p>

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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div className="space-y-4">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          disabled={user?.usernameChanged}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        {!user?.usernameChanged && (
                          <p className="mt-1 text-xs text-gray-500">
                            Username can only be changed once.
                          </p>
                        )}
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={maskEmail(formData.email)}
                            disabled
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          />
                          <button
                            type="button"
                            className="text-sm text-black-600 hover:text-gray-500"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={maskPhone(formData.phone)}
                            disabled
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          />
                          <button
                            type="button"
                            className="text-sm text-black-600 hover:text-gray-500"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender <span className="text-gray-400">?</span>
                        </label>
                        <div className="flex gap-4">
                          {['Male', 'Female', 'Other'].map((gender) => (
                            <label key={gender} className="flex items-center">
                              <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={formData.gender === gender}
                                onChange={handleChange}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">{gender}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition ${
                        uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      {uploadingImage ? 'Uploading...' : 'Select Image'}
                    </label>
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      File size: maximum 1 MB<br />
                      File extension: .JPEG, .PNG
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-start">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save'}
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

export default Profile;
