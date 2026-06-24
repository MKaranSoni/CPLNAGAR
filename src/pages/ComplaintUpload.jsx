import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from "../services/complaintService";
import { 
  UploadCloud, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  Loader2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Map
} from 'lucide-react';

export default function ComplaintUpload() {
  const navigate = useNavigate();

  // Media
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Geolocation
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [wardName, setWardName] = useState('');
  const [wardNumber, setWardNumber] = useState('');
  const [locationError, setLocationError] = useState(false);
  const [isLocating, setIsLocating] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdComplaintData, setCreatedComplaintData] = useState(null);
  const [apiError, setApiError] = useState('');

  const loadingSteps = [
    "Uploading Complaint Evidence...",
    "Capturing Location Metadata...",
    "Running AI Category Analysis...",
    "Generating Complaint Record...",
    "Submitting Complaint..."
  ];

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    setIsLocating(true);
    setLocationError(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const data = await res.json();
            const extractedCity = data.address?.city || data.address?.state_district || data.address?.state || '';
            const displayLandmark = data.display_name?.split(',').slice(0, 3).join(',') || "Unknown Location";
            const detectedArea = data.address?.suburb || data.address?.neighbourhood || data.address?.town || data.address?.county || 'Unknown Area';
            
            let hash = 0;
            for (let i = 0; i < detectedArea.length; i++) {
              hash = detectedArea.charCodeAt(i) + ((hash << 5) - hash);
            }
            const generatedWardNumber = Math.abs(hash) % 100 + 1;
            
            setCity(extractedCity);
            setLandmark(displayLandmark);
            setWardName(detectedArea);
            setWardNumber(`Ward ${generatedWardNumber}`);
          } catch (err) {
            console.error("Failed to reverse geocode:", err);
            setLandmark("Unknown Location");
          } finally {
            setIsLocating(false);
          }
        },
        (err) => {
          console.error(err);
          setLocationError(true);
          setIsLocating(false);
        }
      );
    } else {
      setLocationError(true);
      setIsLocating(false);
    }
  };

  const handleResetImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
  };

  const runSimulatedLoadingSteps = () => {
    return new Promise((resolve) => {
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        if (step >= loadingSteps.length) {
          clearInterval(interval);
          resolve();
        } else {
          setSubmissionStep(step);
        }
      }, 800); // cycle through steps every 800ms
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    setApiError('');
    setSubmissionStep(0);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (latitude) formData.append("latitude", latitude);
      if (longitude) formData.append("longitude", longitude);
      if (city) formData.append("city", city);
      if (landmark) formData.append("landmark", landmark);
      if (wardName) formData.append("wardName", wardName);
      if (wardNumber) formData.append("wardNumber", wardNumber);
      formData.append("image", selectedFile);

      // Run visual progression while actual API call happens concurrently
      const [response] = await Promise.all([
        createComplaint(formData),
        runSimulatedLoadingSteps()
      ]);

      setCreatedComplaintData(response.data);
      setIsSuccess(true);
      setIsSubmitting(false);

      // Redirect after a few seconds of success screen
      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setApiError(error.response?.data?.message || "Failed to create complaint.");
    }
  };

  // SUCCESS COMPONENT
  if (isSuccess && createdComplaintData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in zoom-in duration-500">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-premium border border-emerald-100 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold font-outfit text-slate-800 dark:text-slate-100">Complaint Registered Successfully</h2>
            <p className="text-sm text-slate-500 mt-2">Your civic hazard has been submitted to the NagarSetu administration network.</p>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 border-dashed">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Complaint ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100">CMP-{createdComplaintData.id}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 border-dashed">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</span>
              <span className="font-bold text-brand-violet uppercase text-xs">{createdComplaintData.category || 'General'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 border-dashed">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</span>
              <span className="font-bold text-red-500 uppercase text-xs">{createdComplaintData.severity || 'MODERATE'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                {createdComplaintData.status || 'SUBMITTED'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-4">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Redirecting to tracking dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="max-w-xs w-full space-y-6 text-center">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-brand-violet border-t-transparent animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-brand-purple animate-pulse" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-outfit">{loadingSteps[submissionStep]}</h3>
            
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-violet to-brand-purple transition-all duration-300 ease-out"
                style={{ width: `${((submissionStep + 1) / loadingSteps.length) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-xs font-mono text-slate-400">Processing Step {submissionStep + 1} of {loadingSteps.length}</p>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain">File A Smart Complaint</h2>
        <p className="text-xs text-themeLight-textSub mt-1">Upload a hazard image. NagarSetu AI will automatically scan category, evaluate priorities, and screen duplicates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image Drag & Drop */}
        <div className="space-y-6 lg:col-span-1">
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">
            Image Source Triage
          </h3>

          {!selectedImage ? (
            <div className="p-6 rounded-2xl glass-panel border-dashed border-2 border-purple-200 text-center bg-white/70 dark:bg-slate-900/70 shadow-soft">
              <UploadCloud className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedImage(URL.createObjectURL(file));
                    setSelectedFile(file);
                  }
                }}
                className="text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-3">Upload image for complaint</p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl glass-panel relative bg-white/70 dark:bg-slate-900/70 shadow-soft">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-purple-100 mb-4 bg-slate-900">
                <img src={selectedImage} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleResetImage}
                className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 text-red-400 hover:bg-black/80 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-2">
          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-panel space-y-6 bg-white/70 dark:bg-slate-900/70 shadow-soft">
            
            {/* Row 1: Title */}
            <div>
              <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block mb-2 font-mono">Complaint Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pothole cluster near Sector 4 highway exit"
                className="w-full bg-white dark:bg-slate-900 border border-purple-100 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors shadow-soft"
              />
            </div>

            {/* Row 2: Description */}
            <div>
              <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block mb-2 font-mono">Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the hazard size, duration, and safety threat..."
                className="w-full bg-white dark:bg-slate-900 border border-purple-100 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors shadow-soft"
              />
            </div>

            {/* Row 3: Auto-Captured Geolocation */}
            <div>
              <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block mb-2 font-mono">Geo-Tagged Location</label>
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-inner flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-full bg-blue-100 text-blue-600">
                  {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
                </div>
                
                <div className="flex-1">
                  {isLocating ? (
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Acquiring GPS Signal...</p>
                  ) : locationError ? (
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-red-500">Location access denied or unavailable.</p>
                      <p className="text-xs text-slate-500">Please enable location services to auto-populate the coordinates.</p>
                      <button 
                        type="button" 
                        onClick={fetchLocation} 
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 mt-2 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Retry Location
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{landmark}</p>
                      <p className="text-xs font-bold text-brand-violet mt-1">
                        {wardName && wardNumber ? `${wardNumber} - ${wardName}` : 'Ward: Not Available'}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-900 px-2 py-0.5 border border-slate-200 rounded">Lat: {latitude?.toFixed(5)}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-900 px-2 py-0.5 border border-slate-200 rounded">Lng: {longitude?.toFixed(5)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submission buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-purple-100/50">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl hover:bg-purple-50 text-xs font-bold text-slate-500 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={!selectedImage || isLocating || locationError || isSubmitting}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedImage && !isLocating && !locationError && !isSubmitting
                    ? 'bg-gradient-to-r from-brand-violet to-brand-purple text-white shadow-glow-violet hover:opacity-95 shimmer-btn cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                }`}
              >
                <Check className="w-4 h-4" /> Submit Complaint
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
