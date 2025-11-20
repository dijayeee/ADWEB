import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LoginRequiredModal({ isOpen, onClose, message = 'You need to log in first.' }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  function goToLogin() {
    onClose?.();
    navigate('/login');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Login Required</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="px-4 py-5">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={goToLogin}
            className="px-4 py-2 rounded-md bg-black text-white font-semibold hover:opacity-90"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;


