import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useAuth } from '../Context/AuthContext';
import api from '../config/axios';
import { User as UserIcon, Plus, X, MapPin } from 'lucide-react';

function Address() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('address');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    region: '',
    postalCode: '',
    streetName: '',
    label: 'Home'
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (location.pathname === '/address') {
      setActiveTab('address');
    }
  }, [location.pathname]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/profile/${authUser?.username}`);
      if (response.data.success) {
        setAddresses(response.data.user.addresses || []);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await api.post(`/users/address/${authUser?.username}`, formData);

      if (response.data.success) {
        setSuccess('Address added successfully');
        setShowModal(false);
        setFormData({
          fullName: '',
          phoneNumber: '',
          region: '',
          postalCode: '',
          streetName: '',
          label: 'Home'
        });
        await fetchAddresses();
      } else {
        setError(response.data.error || 'Failed to add address');
      }
    } catch (err) {
      console.error('Error adding address:', err);
      setError(err.response?.data?.error || err.message || 'Error adding address');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (index) => {
    try {
      const response = await api.put(`/users/address/${authUser?.username}/${index}/set-default`);
      if (response.data.success) {
        setSuccess('Default address updated successfully');
        await fetchAddresses();
      } else {
        setError(response.data.error || 'Failed to set default address');
      }
    } catch (err) {
      console.error('Error setting default address:', err);
      setError(err.response?.data?.error || 'Error setting default address');
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await api.delete(`/users/address/${authUser?.username}/${index}`);
      if (response.data.success) {
        await fetchAddresses();
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      setError(err.response?.data?.error || 'Error deleting address');
    }
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
      <div className="min-h-screen bg-black-50">
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
                    className="text-xs text-black-600 hover:text-black-400"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-black-500 uppercase mb-2">My Account</p>
                <button
                  onClick={() => navigate('/profile')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'profile'
                      ? 'bg-gray-50 text-black-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate('/address')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'address'
                      ? 'bg-black text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Address
                </button>
                <button
                  onClick={() => navigate('/change-password')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'change-password'
                      ? 'bg-gray-50 text-black-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Change Password
                </button>
              </div>

              <div className="mt-6 pt-6 border-t space-y-1">
                <p className="text-xs font-semibold text-black-500 uppercase mb-2">My Purchase</p>
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
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-black mb-2">Address</h1>
                  <p className="text-black">Manage your delivery addresses</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-500 transition"
                >
                  <Plus className="h-4 w-4" />
                  New Address
                </button>
              </div>

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

              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-black mb-4">No addresses saved yet</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-black-100 text-black-600 text-xs font-semibold rounded">
                              {address.label}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-gray-900 mb-1">{address.fullName}</p>
                          <p className="text-sm text-gray-600 mb-1">{address.phoneNumber}</p>
                          <p className="text-sm text-gray-600 mb-1">{address.streetName}</p>
                          <p className="text-sm text-gray-600">
                            {address.region}, {address.postalCode}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(index)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">New Address</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({
                    fullName: '',
                    phoneNumber: '',
                    region: '',
                    postalCode: '',
                    streetName: '',
                    label: 'Home'
                  });
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Region, Province, City, Barangay"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="text"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
                placeholder="Street Name, Building, House No."
                required
                className="w-full px-4 py-2 border border-black-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />


              {/* Label As */}
              <div>
                <label className="block text-sm font-medium text-black-700 mb-2">Label As:</label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, label }))}
                      className={`px-4 py-2 rounded-lg border transition ${
                        formData.label === label
                          ? 'border-gray-600 bg-black-50 text-black-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      fullName: '',
                      phoneNumber: '',
                      region: '',
                      postalCode: '',
                      streetName: '',
                      label: 'Home'
                    });
                    setError('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Address;

