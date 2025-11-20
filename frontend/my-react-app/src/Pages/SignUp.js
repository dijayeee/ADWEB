import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginBG from '../Assets/LoginBG.jpg';
import HeaderLog from '../Components/HeaderLog';
import { useAuth } from '../Context/AuthContext';

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'Male',
    profileImage: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation for required fields
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Validate username length
    if (formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Validate gender if provided
    if (formData.gender && !['Male', 'Female', 'Other'].includes(formData.gender)) {
      setError('Please select a valid gender');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || '',
        gender: formData.gender || 'Male',
        profileImage: formData.profileImage.trim() || ''
      });

      if (result.success) {
        // Redirect to home page after successful signup
        navigate('/home');
      } else {
        setError(result.error || 'An error occurred during signup');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${LoginBG})`,
          filter: 'brightness(0.7)'
        }}
      ></div>

      <HeaderLog></HeaderLog>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-between px-12">
        {/* Left Side - Title */}
        <div className="text-white max-w-xl">
          <h1 className="text-7xl font-bold mb-4">ShopHub</h1>
          <p className="text-xl text-gray-300">Simplicity In Every Thread.</p>
        </div>

        {/* Right Side - Sign Up Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            {/* Last Name */}
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (Optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            {/* Gender */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>

            {/* Login Section */}
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">Already have an account?</p>
              <Link
                to="/login"
                className="inline-block bg-black text-white px-8 py-2 rounded font-semibold hover:bg-gray-800 transition"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

