import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useAuth } from '../Context/AuthContext';
import api from '../config/axios';
import { Plus, X } from 'lucide-react';
import ProfileSidebar from '../Components/ProfileSidebar';

function Address() {
  const navigate = useNavigate();
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

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/users/profile/${authUser?.username}`);

      if (response.data.success) {
        setAddresses(response.data.user.addresses || []);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Error fetching addresses');
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
      setError(err.response?.data?.error || 'Error adding address');
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
    if (!window.confirm('Are you sure you want to delete this address?')) return;

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

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex flex-col md:flex-row gap-6">

            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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

              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}
              {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">{success}</div>}

              <div>
                {addresses.length === 0 ? (
                  <p className="text-gray-600">No addresses found.</p>
                ) : (
                  addresses.map((address, index) => (
                    <div key={index} className="border-b py-4 flex justify-between items-center">

                      <div>
                        <p className="font-semibold">{address.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {address.streetName}, {address.region}, {address.postalCode}
                        </p>
                        <p className="text-xs text-gray-500">
                          {address.phoneNumber} • {address.label}
                        </p>

                        {address.isDefault && (
                          <span className="text-green-600 text-xs font-semibold">Default</span>
                        )}
                      </div>

                      <div className="flex gap-2">
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
                  ))
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">

            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">

              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">New Address</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required className="px-4 py-2 border border-gray-300 rounded-lg" />

                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className="px-4 py-2 border border-gray-300 rounded-lg" />
                </div>

                <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="Region, Province, City, Barangay" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />

                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />

                <input type="text" name="streetName" value={formData.streetName} onChange={handleChange} placeholder="Street Name, Building, House No." required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />

                <div>
                  <label className="block text-sm font-medium mb-2">Label As:</label>

                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, label }))}
                        className={`px-4 py-2 rounded-lg border ${
                          formData.label === label ? 'border-black bg-gray-100' : 'border-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

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
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-black text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {saving ? 'Submitting...' : 'Submit'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}

export default Address;
