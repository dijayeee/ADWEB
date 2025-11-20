import { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpModal from './HelpModal';

function HeaderLog() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="relative z-10 bg-black text-white px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">WearHaus</Link>
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
        >
          <span className="mr-2">?</span>
          <span>Help</span>
        </button>
      </div>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}

export default HeaderLog;