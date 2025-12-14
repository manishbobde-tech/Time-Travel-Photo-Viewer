import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for mirror effect if using front camera usually, 
        // but here we just draw raw. To mirror: context.scale(-1, 1); context.drawImage(..., -width, 0);
        // Let's keep it standard for now to avoid text reversal issues in backgrounds if any.
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-gray-800">
      {error ? (
        <div className="text-red-400 p-8 text-center">
          <p className="mb-4 text-xl">{error}</p>
          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition flex items-center gap-2">
            <Upload size={20} />
            Upload Photo Instead
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-8 flex gap-6 items-center z-10">
            <button 
              onClick={onCancel}
              className="p-4 rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm transition"
              title="Cancel"
            >
              <X size={24} />
            </button>
            
            <button 
              onClick={takePhoto}
              className="p-6 rounded-full bg-white border-4 border-gray-300 hover:border-indigo-500 hover:scale-105 transition shadow-lg"
              title="Take Photo"
            >
              <div className="w-4 h-4 bg-transparent" /> 
            </button>

            <label className="p-4 rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm transition cursor-pointer" title="Upload Image">
              <Upload size={24} />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;