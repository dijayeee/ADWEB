import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/axios';

function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('request');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!identifier.trim()) {
      setError('Please enter the email or username on your account.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await api.post('/users/forgot-password', { identifier });
      setStatusMessage(data.message);
      setResetToken(data.resetToken || '');
      setStep('reset');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to generate reset token. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!resetToken.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await api.post('/users/reset-password', {
        token: resetToken.trim(),
        newPassword
      });
      setStatusMessage(data.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to reset password. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email or username and follow the steps to create a new password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {statusMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {statusMessage}
            {resetToken && (
              <p className="text-xs text-gray-600 mt-2 break-all">
                Reset Token: <span className="font-mono">{resetToken}</span>
              </p>
            )}
          </div>
        )}

        {step === 'request' && (
          <form className="space-y-4" onSubmit={handleRequestToken}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter your registered email or username"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Token'}
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reset Token
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Paste the reset token you received"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter a new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Confirm the new password"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="text-center text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

