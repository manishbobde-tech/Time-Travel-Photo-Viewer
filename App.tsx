import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import SceneSelector from './components/SceneSelector';
import ResultView from './components/ResultView';
import { generateTimeTravelScene } from './services/geminiService';
import { AppState, Era, Toast } from './types';
import { Clock, Info } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (image: string) => {
    setUserImage(image);
    setAppState('SELECT_ERA');
  };

  const handleSelectEra = async (era: Era) => {
    if (!userImage) return;
    
    setSelectedEra(era);
    setAppState('PROCESSING');
    setError(null);

    try {
      const generated = await generateTimeTravelScene(userImage, era.prompt);
      setResultImage(generated);
      setAppState('RESULT');
    } catch (err: any) {
      setError(err.message || "Time travel malfunction! Please try again.");
      setAppState('SELECT_ERA');
    }
  };

  const resetApp = () => {
    setAppState('HOME');
    setUserImage(null);
    setResultImage(null);
    setSelectedEra(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-gray-800 bg-[#0f0f13]/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
          <div className="bg-gradient-to-tr from-purple-600 to-blue-500 p-2 rounded-xl shadow-lg shadow-purple-900/20">
            <Clock size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            ChronoSnap
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Info size={14}/> Powered by Gemini 2.5 Flash</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-88px)]">
        
        {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg max-w-md w-full text-center animate-pulse">
                {error}
            </div>
        )}

        {appState === 'HOME' && (
          <div className="text-center max-w-2xl space-y-8 animate-fade-in-up">
             <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                    Step Into <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
                        History
                    </span>
                </h1>
                <p className="text-xl text-gray-400">
                    The AI-powered photo booth that transports you through time. 
                    From Ancient Egypt to Cyberpunk 2077.
                </p>
             </div>
             
             <button 
                onClick={() => setAppState('CAPTURE')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-purple-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-500 active:scale-95"
             >
                Start Time Travel
                <div className="absolute -inset-3 rounded-full bg-purple-400 opacity-20 group-hover:opacity-40 blur-lg transition duration-200" />
             </button>

             <div className="grid grid-cols-3 gap-4 mt-12 opacity-50">
                <div className="h-32 bg-gray-800 rounded-lg border border-gray-700 transform rotate-[-6deg]"></div>
                <div className="h-32 bg-gray-800 rounded-lg border border-gray-700 transform translate-y-[-10px]"></div>
                <div className="h-32 bg-gray-800 rounded-lg border border-gray-700 transform rotate-[6deg]"></div>
             </div>
          </div>
        )}

        {appState === 'CAPTURE' && (
          <div className="w-full max-w-2xl animate-fade-in">
             <h2 className="text-center text-2xl font-bold mb-6 text-gray-200">First, we need your face</h2>
             <div className="aspect-[3/4] sm:aspect-video w-full">
                <CameraCapture 
                    onCapture={handleCapture} 
                    onCancel={() => setAppState('HOME')}
                />
             </div>
          </div>
        )}

        {appState === 'SELECT_ERA' && (
            <SceneSelector 
                onSelect={handleSelectEra}
                onBack={() => setAppState('CAPTURE')}
            />
        )}

        {appState === 'PROCESSING' && (
            <div className="flex flex-col items-center gap-6 animate-pulse text-center">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-md opacity-50"></div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">Calibrating Flux Capacitor...</h3>
                    <p className="text-purple-300 mt-2">Transporting you to {selectedEra?.name}</p>
                </div>
            </div>
        )}

        {appState === 'RESULT' && userImage && resultImage && selectedEra && (
            <ResultView 
                originalImage={userImage}
                resultImage={resultImage}
                era={selectedEra}
                onReset={resetApp}
            />
        )}

      </main>
    </div>
  );
};

export default App;