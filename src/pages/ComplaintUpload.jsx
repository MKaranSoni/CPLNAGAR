import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from "../services/complaintService";
import { useCivicData } from '../hooks/useCivicData';
import { 
  UploadCloud, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  Loader2,
  Trash2
} from 'lucide-react';

export default function ComplaintUpload() {
  const { addComplaint } = useCivicData();
  const navigate = useNavigate();

  // Simulated AI check stages
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Waste Management');
  const [priority, setPriority] = useState('Medium');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);

  // Mock sample image sets to choose for simple sandbox testing
  

  

    // Simulate progressive scanner loader bar
    // const interval = setInterval(() => {
    //   setScanProgress((prev) => {
    //     if (prev >= 100) {
    //       clearInterval(interval);
    //       setIsScanning(false);
    //       setAiAnalysisComplete(true);
          
    //       // Autofill form based on predicted AI metadata
    //       setTitle(sample.predTitle);
    //       setDescription(sample.predDescription);
    //       setCategory(sample.predCategory);
    //       setPriority(sample.predPriority);
    //       setLocationName(sample.predLocation);
    //       setLatitude(sample.predLat);
    //       setLongitude(sample.predLng);

    //       return 100;
    //     }
    //     return prev + 25;
    //   });
    // }, 400);

  const handleResetImage = () => {
    setSelectedImage(URL.createObjectURL(file));
    setSelectedFile(file);
    setAiAnalysisComplete(false);
    setTitle('');
    setDescription('');
    setLocationName('');
  };
  const severityMap = {
  Low: "LOW",
  Medium: "MODERATE",
  High: "HIGH",
  Critical: "CRITICAL"
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    if (selectedFile) {
      formData.append(
        "image",
        selectedFile
      );
    }

    const response =
      await createComplaint(formData);

    console.log(
      "Complaint Created:",
      response.data
    );

    alert(
      "Complaint Submitted Successfully"
    );

    navigate("/tracking");

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to create complaint"
    );
  }
};

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain">File A Smart Complaint</h2>
        <p className="text-xs text-themeLight-textSub mt-1">Upload a hazard image. NagarSetu AI will automatically scan category, evaluate priorities, and screen duplicates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image Drag & Drop Sandbox */}
        <div className="space-y-6 lg:col-span-1">
  <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">
    Image Source Triage
  </h3>

  {!selectedImage ? (
    <div className="p-6 rounded-2xl glass-panel border-dashed border-2 border-purple-200 text-center bg-white/70 shadow-soft">
      <UploadCloud className="w-12 h-12 text-purple-300 mx-auto mb-4" />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setSelectedImage(URL.createObjectURL(file));
          }
        }}
        className="text-xs"
      />

      <p className="text-[11px] text-slate-500 mt-3">
        Upload image for complaint
      </p>
    </div>
  ) : (
    <div className="p-5 rounded-2xl glass-panel relative bg-white/70 shadow-soft">
      <div className="relative rounded-xl overflow-hidden aspect-video border border-purple-100 mb-4 bg-slate-900">
        <img src={selectedImage} className="w-full h-full object-cover" />
      </div>

      <button
        onClick={handleResetImage}
        className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 text-red-400"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )}
</div>
          
   

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-panel space-y-6 bg-white/70 shadow-soft">
            
            {/* Row 1: Title */}
            <div>
              <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block mb-2 font-mono">Complaint Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pothole cluster near Sector 4 highway exit"
                className="w-full bg-white border border-purple-100 text-slate-800 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors shadow-soft"
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
                className="w-full bg-white border border-purple-100 text-slate-800 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors shadow-soft"
              />
            </div>

            {/* Row 3: Category & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block mb-2 font-mono">AI Predicted Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-slate-800 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors shadow-soft"
                >
                  <option value="Waste Management">Waste Management</option>
                  <option value="Road & Infrastructure">Road & Infrastructure</option>
                  <option value="Street Lighting">Street Lighting</option>
                  <option value="Water & Sewage">Water & Sewage</option>
                </select>
              </div>

              {/* <div>
                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block mb-2 font-mono">Priority Tier Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-slate-800 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors shadow-soft"
                >
                  <option value="Critical">Critical (Immediate Road Safety Threat)</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div> */}
            </div>

            {/* Row 4: Location Address */}
            <div>
              <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block mb-2 font-mono">Geo-Tagged Location / Landmarks</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Metro Pillar 114, Outer Ring Road, New Delhi"
                  className="w-full bg-white border border-purple-100 text-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors shadow-soft"
                />
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
                disabled={!selectedImage || isScanning}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedImage && !isScanning
                    ? 'bg-gradient-to-r from-brand-violet to-brand-purple text-white shadow-glow-violet hover:opacity-95 shimmer-btn cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" /> Submit To AI Triage Pipeline
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
              );
            };
            
            
