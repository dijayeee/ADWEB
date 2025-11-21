import { useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../config/axios';

export default function ProfileSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await api.get(`/users/profile/${authUser?.username}`);
        if (response.data.success) {
          setUser(response.data.user);
          setImagePreview(response.data.user.profileImage || '');
        }
      } catch (err) {
        setImagePreview('');
      }
    }
    fetchUserProfile();
  }, [authUser]);

  return (
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
          onClick={() => { setActiveTab('profile'); navigate('/profile'); }}
          className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${activeTab === 'profile' ? 'bg-black text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Profile
        </button>
        <button
          onClick={() => { setActiveTab('address'); navigate('/address'); }}
          className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${activeTab === 'address' ? 'bg-black text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Address
        </button>
        <button
          onClick={() => { setActiveTab('change-password'); navigate('/change-password'); }}
          className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${activeTab === 'change-password' ? 'bg-black text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Change Password
        </button>
      </div>
      <div className="mt-6 pt-6 border-t space-y-1">
        <p className="text-xs font-semibold text-black uppercase mb-2">My Purchase</p>
        <button
          onClick={() => { setActiveTab('my-purchase'); navigate('/my-purchase'); }}
          className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${activeTab === 'my-purchase' ? 'bg-black text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          My Orders
        </button>
      </div>
    </div>
  );
}
