import React, { useState } from 'react';
import { Era } from '../types';
import { RefreshCw, Download, Wand2, Search, ArrowLeft } from 'lucide-react';
import { editGeneratedImage, analyzeImageContent } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ResultViewProps {
  originalImage: string;
  resultImage: string;
  era: Era;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ originalImage, resultImage: initialResultImage, era, onReset }) => {
  const [currentImage, setCurrentImage] = useState(initialResultImage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  
  // To show loading state during edit
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `chronosnap-${era.id}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAnalyze = async () => {
    if (analysisResult) return; // Already analyzed
    setIsAnalyzing(true);
    try {
        const text = await analyzeImageContent(currentImage);
        setAnalysisResult(text);
    } catch (e) {
        alert("Failed to analyze image.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim()) return;

    setIsProcessingEdit(true);
    try {
        const newImage = await editGeneratedImage(currentImage, editPrompt);
        setCurrentImage(newImage);
        setEditPrompt('');
        setAnalysisResult(null); // Reset analysis as image changed
    } catch (e) {
        alert("Failed to edit image.");
    } finally {
        setIsProcessingEdit(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-start h-full">
      
      {/* Image Column */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <button 
          onClick={onReset}
          className="self-start flex items-center gap-2 text-gray-400 hover:text-white transition mb-2"
        >
          <ArrowLeft size={16} /> Start Over
        </button>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-black aspect-[3/4] group">
            <img 
              src={currentImage} 
              alt="Generated Result" 
              className="w-full h-full object-cover"
            />
            {isProcessingEdit && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 flex-col gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-purple-300 font-semibold animate-pulse">Applying Magic...</p>
                </div>
            )}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={handleDownload}
                    className="p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition"
                    title="Download"
                >
                    <Download size={20} />
                </button>
            </div>
        </div>

        <div className="flex gap-2 justify-center">
            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-600 opacity-50 hover:opacity-100 transition cursor-pointer" title="Original">
                <img src={originalImage} className="w-full h-full object-cover" alt="Original" />
            </div>
            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-purple-500 cursor-pointer" title="Current">
                 <img src={currentImage} className="w-full h-full object-cover" alt="Current" />
            </div>
        </div>
      </div>

      {/* Controls Column */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div>
            <h2 className="text-4xl font-bold text-white mb-2">{era.name}</h2>
            <p className="text-purple-300 text-lg">{era.description}</p>
        </div>

        {/* Feature: Text Editing (Nano Banana) */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
                <Wand2 size={24} />
                <h3 className="text-xl font-semibold">Magic Editor</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
                Use Gemini to tweak your photo. Try "Make it black and white" or "Add a futuristic neon glow".
            </p>
            <form onSubmit={handleEdit} className="flex gap-2">
                <input 
                    type="text" 
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Describe your edit..."
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                    disabled={isProcessingEdit}
                />
                <button 
                    type="submit"
                    disabled={isProcessingEdit || !editPrompt.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                >
                    {isProcessingEdit ? <RefreshCw className="animate-spin" size={20}/> : "Edit"}
                </button>
            </form>
        </div>

        {/* Feature: Analyze (Gemini 3 Pro) */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 flex-1 min-h-[200px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-blue-400">
                    <Search size={24} />
                    <h3 className="text-xl font-semibold">Analysis</h3>
                </div>
                {!analysisResult && (
                    <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="text-xs uppercase tracking-wider font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                    </button>
                )}
            </div>
            
            <div className="flex-1 bg-gray-900/50 rounded-lg p-4 overflow-y-auto custom-scrollbar border border-gray-800 max-h-[300px]">
                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
                        <RefreshCw className="animate-spin text-blue-500" size={32} />
                        <p>Consulting the archives...</p>
                    </div>
                ) : analysisResult ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{analysisResult}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                        <p>Click analyze to reveal details about this historical moment.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultView;