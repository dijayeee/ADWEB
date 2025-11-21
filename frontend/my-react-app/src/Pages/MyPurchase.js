import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useAuth } from '../Context/AuthContext';
import api from '../config/axios';
import { Package, Check, User as UserIcon } from 'lucide-react';
import OrderReceivedModal from '../Components/OrderReceivedModal';

function MyPurchase() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [activeTab, setActiveTab] = useState('my-purchase');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceivedModal, setShowReceivedModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open modal
  const openReceivedModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowReceivedModal(true);
  };

  // Confirm received
  const handleMarkAsReceived = async () => {
    try {
      setLoading(true);
      await api.put(`/orders/mark-received/${selectedOrderId}`);
      setShowReceivedModal(false);
      setSelectedOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error('Error marking order as received:', err);
    }
    setLoading(false);
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
                  {authUser?.profileImage ? (
                    <img
                      src={authUser.profileImage}
                      alt="Profile"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-400" />
                  )}
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
                  className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={() => navigate('/address')}
                  className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Address
                </button>

                <button
                  onClick={() => navigate('/change-password')}
                  className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Change Password
                </button>
              </div>

              <div className="mt-6 pt-6 border-t space-y-1">
                <p className="text-xs font-semibold text-black uppercase mb-2">My Purchase</p>
                <button
                  onClick={() => navigate('/my-purchase')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition ${
                    activeTab === 'my-purchase'
                      ? 'bg-black text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Orders
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600 mb-6">View your purchase history</p>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <button
                    onClick={() => navigate('/home')}
                    className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-500"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <div
                      key={order._id || index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order ID: {order._id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString()
                              : 'Date not available'}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Status:{' '}
                            <span
                              className={`font-semibold ${
                                order.status === 'pending'
                                  ? 'text-yellow-600'
                                  : order.status === 'processing'
                                  ? 'text-blue-600'
                                  : order.status === 'shipped'
                                  ? 'text-purple-600'
                                  : order.status === 'delivered'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {order.status}
                            </span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₱{Number(order.total || 0).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.items?.length || 0} item(s)
                          </p>

                          {(order.status === 'shipped' ||
                            order.status === 'processing') && (
                            <button
                              onClick={() => openReceivedModal(order._id)}
                              className="mt-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2 ml-auto"
                            >
                              <Check className="h-4 w-4" />
                              Order Received
                            </button>
                          )}

                          {order.status === 'delivered' && (
                            <div className="mt-2 px-3 py-1 rounded-md bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1 ml-auto w-fit">
                              <Check className="h-3 w-3" />
                              Completed
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>

                        <div className="space-y-2">
                          {order.items?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}

                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Quantity: {item.quantity} × ₱
                                  {item.price?.toFixed(2)}
                                </p>

                                {(item.selectedColor || item.selectedSize) && (
                                  <p className="text-xs text-gray-500">
                                    {item.selectedColor} {item.selectedSize}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
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

      <OrderReceivedModal
        isOpen={showReceivedModal}
        orderId={selectedOrderId}
        onConfirm={handleMarkAsReceived}
        onCancel={() => {
          setShowReceivedModal(false);
          setSelectedOrderId(null);
        }}
        isLoading={loading}
      />

      <Footer />
    </>
  );
}

export default MyPurchase;
