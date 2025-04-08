// components/Loader.jsx
import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

export default function Loader() {
  const { loaded, total, progress } = useProgress();
  const [dots, setDots] = useState('.');
  
  // Animated loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate progress percentage
  const progressPercent = total > 0 ? Math.round((loaded / total) * 100) : 0;
  const displayProgress = Math.max(progressPercent, Math.round(progress));
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-black via-rose-900 to-black">
      <div className="text-white text-2xl mb-6 font-bold">
        Loading your birthday surprise{dots}
      </div>
      
      <div className="w-64 h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-300"
          style={{ width: `${displayProgress}%` }}
        ></div>
      </div>
      
      <div className="text-white text-sm">
        {displayProgress}%
      </div>
      
      {/* Debug information - hidden in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 text-white text-xs opacity-50">
          <div>Loaded: {loaded} / Total: {total}</div>
          <div>Raw progress: {Math.round(progress)}%</div>
        </div>
      )}
    </div>
  );
}   