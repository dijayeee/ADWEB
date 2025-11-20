import { useEffect, useMemo, useState } from 'react';
import { LogOut, Package, Users as UsersIcon, LayoutDashboard, Box, Edit2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'users'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // products state
  const [products, setProducts] = useState([]);
  // Admin product form
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    stock: '', 
    image: '', 
    category: 'Women',
    colors: '',
    sizes: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // orders state
  const [orders, setOrders] = useState([]);

  // users state
  const [users, setUsers] = useState([]);

  // Fetch products and orders from API
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.error || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.error || 'Error fetching orders');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/users');
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error || 'Error fetching users');
    }
  };

  const totals = useMemo(() => {
    return {
      orders: orders.length,
      products: products.length,
      users: users.length
    };
  }, [orders, products, users]);

  function resetForm() {
    setForm({ 
      name: '', 
      price: '', 
      stock: '', 
      image: '', 
      category: 'Women',
      colors: '',
      sizes: '',
      description: ''
    });
    setEditingId(null);
    setError('');
    setImagePreview('');
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload image (Content-Type will be set automatically by axios for FormData)
      const response = await api.post('/upload/image', formData);

      if (response.data.success) {
        // Get the full URL (backend URL + image path)
        // Remove /api from baseURL and add the image path
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        const imageUrl = `${baseUrl}${response.data.imageUrl}`;
        setForm((prev) => ({ ...prev, image: imageUrl }));
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
  }

  async function handleAddOrUpdateProduct() {
    if (!form.name || !form.price || !form.stock || !form.category) {
      setError('Please fill in all required fields (name, price, stock, category)');
      return;
    }

    const priceNum = parseFloat(form.price);
    const stockNum = parseInt(form.stock, 10);
    if (Number.isNaN(priceNum) || Number.isNaN(stockNum) || priceNum < 0 || stockNum < 0) {
      setError('Price and stock must be valid positive numbers');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Parse colors and sizes from comma-separated strings
      const colorsArray = form.colors 
        ? form.colors.split(',').map(c => c.trim()).filter(c => c.length > 0)
        : [];
      const sizesArray = form.sizes 
        ? form.sizes.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [];

      const productData = {
        name: form.name,
        price: priceNum,
        stock: stockNum,
        image: form.image || '',
        category: form.category,
        colors: colorsArray,
        sizes: sizesArray
        ,
        description: form.description || ''
      };

      let response;
      if (editingId) {
        // Update existing product
        response = await api.put(`/products/${editingId}`, productData);
      } else {
        // Create new product
        response = await api.post('/products', productData);
      }

      if (response.data.success) {
        await fetchProducts(); // Refresh products list
        resetForm();
      } else {
        setError(response.data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.error || err.message || 'Error saving product. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleEditProduct(product) {
    setEditingId(product._id || product.id);
    const imageUrl = product.image || '';
    setForm({ 
      name: product.name, 
      price: String(product.price), 
      stock: String(product.stock), 
      image: imageUrl,
      category: product.category || 'Women',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      description: product.description || ''
    });
    setImagePreview(imageUrl);
    setError('');
  }

  async function handleDeleteProduct(id) {
    const product = products.find(p => (p._id || p.id) === id);
    const productName = product?.name || 'this product';
    
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.delete(`/products/${id}`);

      if (response.data.success) {
        await fetchProducts(); // Refresh products list
        if (editingId === id) resetForm();
      } else {
        setError(response.data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.error || 'Error deleting product');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveUser(username) {
    if (username === 'admin') return; // don't remove admin
    
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.delete(`/users/users/${username}`);
      if (response.data.success) {
        await fetchUsers();
      } else {
        setError(response.data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.error || 'Error deleting user');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateOrderStatus(orderId, newStatus) {
    try {
      setLoading(true);
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        await fetchOrders(); // Refresh orders list
      } else {
        setError(response.data.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.error || 'Error updating order status');
    } finally {
      setLoading(false);
    }
  }

  function handleSignout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">WearHaus</div>
        <button onClick={handleSignout} className="flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-md font-semibold hover:opacity-90">
          <LogOut className="h-5 w-5" />
          Signout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Account</h1>
        <p className="text-gray-600 mb-6">Manage your profile, products, order and users</p>

        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            <div className="flex items-center gap-4 md:col-span-2">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">Admin</p>
                <p className="text-sm text-gray-600">Example@gmail.com</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600">Orders</p>
              <div className="mt-2 px-3 py-2 bg-black text-white rounded-lg text-xl font-bold">{totals.orders}</div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600">Products</p>
              <div className="mt-2 px-3 py-2 bg-black text-white rounded-lg text-xl font-bold">{totals.products}</div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600">Users</p>
              <div className="mt-2 px-3 py-2 bg-black text-white rounded-lg text-xl font-bold">{totals.users}</div>
            </div>
          </div>
        </div>

        <div className="bg-black text-white rounded-xl mb-6">
          <div className="flex gap-2 px-4">
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'dashboard' ? 'border-b-2 border-white' : ''}`}>
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'products' ? 'border-b-2 border-white' : ''}`}>
              <Box className="h-5 w-5" /> Products
            </button>
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'orders' ? 'border-b-2 border-white' : ''}`}>
              <Package className="h-5 w-5" /> Orders
            </button>
            <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'users' ? 'border-b-2 border-white' : ''}`}>
              <UsersIcon className="h-5 w-5" /> Users
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black text-white rounded-xl p-6 text-center">
                <p className="text-sm opacity-80">Total Orders</p>
                <p className="text-5xl font-bold mt-2">{totals.orders}</p>
              </div>
              <div className="bg-black text-white rounded-xl p-6 text-center">
                <p className="text-sm opacity-80">Total Products</p>
                <p className="text-5xl font-bold mt-2">{totals.products}</p>
              </div>
              <div className="bg-black text-white rounded-xl p-6 text-center">
                <p className="text-sm opacity-80">Total Users</p>
                <p className="text-5xl font-bold mt-2">{totals.users}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleFormChange} 
                  placeholder="Product Name *" 
                  className="border rounded-md px-3 py-2" 
                />
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleFormChange} 
                  className="border rounded-md px-3 py-2"
                >
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Kids">Kids</option>
                  <option value="Baby">Baby</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  name="price" 
                  type="number"
                  step="0.01"
                  value={form.price} 
                  onChange={handleFormChange} 
                  placeholder="Price *" 
                  className="border rounded-md px-3 py-2" 
                />
                <input 
                  name="stock" 
                  type="number"
                  value={form.stock} 
                  onChange={handleFormChange} 
                  placeholder="Stock *" 
                  className="border rounded-md px-3 py-2" 
                />
              </div>
              
              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition ${
                        uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    </label>
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, image: '' }));
                          setImagePreview('');
                        }}
                        className="ml-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="w-20 h-20 border rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF, WEBP (Max 5MB)</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  name="colors" 
                  value={form.colors} 
                  onChange={handleFormChange} 
                  placeholder="Colors (comma-separated, e.g., Black, White, Blue)" 
                  className="border rounded-md px-3 py-2" 
                />
                <input 
                  name="sizes" 
                  value={form.sizes} 
                  onChange={handleFormChange} 
                  placeholder="Sizes (comma-separated, e.g., S, M, L, XL)" 
                  className="border rounded-md px-3 py-2" 
                />
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Short description of the product (shown on product pages)"
                  className="w-full border rounded-md px-3 py-2 min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleAddOrUpdateProduct} 
                  disabled={loading}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : editingId ? <><Edit2 className="h-4 w-4" /> Update Product</> : <><Plus className="h-4 w-4" /> Add Product</>}
                </button>
                {editingId && (
                  <button 
                    onClick={resetForm} 
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y border rounded-lg">
              {loading && products.length === 0 && <p className="p-4 text-gray-600">Loading products...</p>}
              {!loading && products.length === 0 && <p className="p-4 text-gray-600">No products yet.</p>}
              {products.map((p) => (
                <div key={p._id || p.id} className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon className="h-6 w-6 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-600">
                      ${p.price.toFixed(2)} • Stock: {p.stock} • Category: {p.category}
                    </p>
                    {p.colors && p.colors.length > 0 && (
                      <p className="text-xs text-gray-500">Colors: {Array.isArray(p.colors) ? p.colors.join(', ') : p.colors}</p>
                    )}
                    {p.sizes && p.sizes.length > 0 && (
                      <p className="text-xs text-gray-500">Sizes: {Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes}</p>
                    )}
                    {p.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{p.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditProduct(p)} 
                      className="px-3 py-2 rounded-md border text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(p._id || p.id)} 
                      className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 border">Order ID</th>
                    <th className="p-3 border">User</th>
                    <th className="p-3 border">Items</th>
                    <th className="p-3 border">Total</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-4 text-gray-600 text-center">No orders yet.</td>
                    </tr>
                  )}
                  {orders.map((o) => (
                    <tr key={o._id || o.id} className="border-t">
                      <td className="p-3 border">{o._id || o.id}</td>
                      <td className="p-3 border">{o.user?.username || 'Guest'}</td>
                      <td className="p-3 border">{o.items?.length || 0}</td>
                      <td className="p-3 border">${Number(o.total || 0).toFixed(2)}</td>
                      <td className="p-3 border">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                      <td className="p-3 border">
                        <span className={`px-2 py-1 rounded text-xs ${
                          o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          o.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          o.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          o.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {o.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-3 border">
                        {o.status !== 'shipped' && o.status !== 'delivered' && o.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o._id || o.id, o.status === 'pending' ? 'processing' : 'shipped')}
                            disabled={loading}
                            className="px-3 py-1 rounded-md bg-black text-white text-sm font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition"
                          >
                            {o.status === 'pending' ? 'Process' : 'Ship'}
                          </button>
                        )}
                        {o.status === 'delivered' && (
                          <span className="text-sm text-green-600 font-semibold">Completed</span>
                        )}
                        {o.status === 'cancelled' && (
                          <span className="text-sm text-red-600 font-semibold">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Users</h2>
            <div className="divide-y border rounded-lg">
              {users.length === 0 && <p className="p-4 text-gray-600">No users found.</p>}
              {users.map((u) => (
                <div key={u.username} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{u.firstName ? `${u.firstName} ${u.lastName}` : u.username}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleRemoveUser(u.username)}
                      disabled={u.username === 'admin'}
                      className={`px-3 py-2 rounded-md ${u.username === 'admin' ? 'bg-gray-300 text-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
                    >
                      {u.username === 'admin' ? 'Protected' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
