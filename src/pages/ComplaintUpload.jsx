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

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Waste Management');
  const [priority, setPriority] = useState('Medium');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);

  // Mock sample image sets to choose for simple sandbox testing
  const sampleImages = [
    {
      id: "samp-garbage",
      title: "Garbage Pile",
      url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&auto=format&fit=crop&q=80",
      predCategory: "Waste Management",
      predPriority: "High",
      predLocation: "Sector 4 Main Market, Near Mother Dairy, New Delhi",
      predTitle: "Overflowing Smart-Trash Dumpster near Sector 4 Market",
      predDescription: "The garbage bin has been overflowing for the last three days. It has started emitting a foul smell, and stray dogs are tearing open plastic bags.",
      predLat: 28.6139,
      predLng: 77.2090
    },
    {
      id: "samp-pothole",
      title: "Deep Pothole",
      url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=400&auto=format&fit=crop&q=80",
      predCategory: "Road & Infrastructure",
      predPriority: "Critical",
      predLocation: "Outer Ring Road Exit, Near Metro Pillar 114, New Delhi",
      predTitle: "Deep Pothole on Outer Ring Road Flyover",
      predDescription: "A deep pothole has emerged right after the flyover exit. It's extremely dangerous for two-wheelers, especially at night when streetlights are dim.",
      predLat: 28.6250,
      predLng: 77.2150
    },
    {
      id: "samp-light",
      title: "Broken Streetlight",
      url: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?w=400&auto=format&fit=crop&q=80",
      predCategory: "Street Lighting",
      predPriority: "Medium",
      predLocation: "Sector 12 Public Park, Inner Jogging Track, New Delhi",
      predTitle: "Non-Functional LED Streetlights along Sector 12 Park Pathway",
      predDescription: "Entire stretch of streetlights from Corner 2 to the main gate has been dark for a week. Many residents who go for evening walks feel extremely unsafe.",
      predLat: 28.6080,
      predLng: 77.2320
    }
  ];

  const handleSelectSample = (sample) => {
    setSelectedImage(sample.url);
    setIsScanning(true);
    setScanProgress(0);
    setAiAnalysisComplete(false);

    // Simulate progressive scanner loader bar
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setAiAnalysisComplete(true);
          
          // Autofill form based on predicted AI metadata
          setTitle(sample.predTitle);
          setDescription(sample.predDescription);
          setCategory(sample.predCategory);
          setPriority(sample.predPriority);
          setLocationName(sample.predLocation);
          setLatitude(sample.predLat);
          setLongitude(sample.predLng);

          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleResetImage = () => {
    setSelectedImage(null);
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

    const complaintData = {
      title,
      description,
      category,

      severity: severityMap[priority],

      latitude,
      longitude,

      imageUrl: selectedImage
    };

    const response =
      await createComplaint(complaintData);

    console.log(
      "Complaint Created:",
      response.data
    );

    alert("Complaint Submitted Successfully");

    navigate("/tracking");

  } catch (error) {

    console.error("Complaint Error:", error);

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
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">Image Source Triage</h3>
          
          {!selectedImage ? (
            <div className="p-6 rounded-2xl glass-panel border-dashed border-2 border-purple-200 hover:border-brand-violet/40 transition-all text-center bg-white/70 shadow-soft">
              <UploadCloud className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">Select Sandbox Image</h4>
              <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto mt-1 mb-6">Choose a mock image card below to trigger AI Computer Vision triage.</p>

              {/* Sample list buttons */}
              <div className="space-y-2">
                {sampleImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => handleSelectSample(img)}
                    className="w-full p-2.5 rounded-xl bg-purple-50/40 hover:bg-purple-50 border border-purple-100/60 hover:border-purple-200 text-xs font-semibold text-slate-700 flex items-center gap-3 transition-all shadow-soft"
                  >
                    <img src={img.url} alt={img.title} className="w-8 h-8 rounded object-cover border border-purple-100" />
                    <span>{img.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl glass-panel relative bg-white/70 shadow-soft">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-purple-100 mb-4 bg-slate-900">
                <img src={selectedImage} alt="Selected Issue" className="w-full h-full object-cover" />
                
                {/* Simulated scanner visual bar */}
                {isScanning && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-brand-violet animate-pulse shadow-glow-violet" style={{ top: `${scanProgress}%` }} />
                )}
              </div>

              {/* Reset/Discard Button */}
              {!isScanning && (
                <button
                  onClick={handleResetImage}
                  className="absolute top-8 right-8 p-2 rounded-lg bg-black/60 text-red-400 hover:text-red-300 hover:bg-black/80 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* AI Processing Panel */}
              {isScanning && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-violet/5 border border-brand-violet/10 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-violet" />
                  <div className="flex-1">
                    <p className="font-bold text-brand-violet">AI Triage Active: {scanProgress}%</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Extracting geographic markers & checking duplicates...</p>
                  </div>
                </div>
              )}

              {aiAnalysisComplete && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-brand-violet/5 border border-brand-violet/15">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-violet mb-2">
                      <Sparkles className="w-4 h-4 text-brand-violet" />
                      <span>AI SCAN VERIFIED</span>
                    </div>

                    <div className="space-y-2 text-[10px] font-mono text-slate-550">
                      <div className="flex justify-between border-b border-purple-100/50 pb-1">
                        <span>CONFIDENCE</span>
                        <span className="text-slate-800 font-bold">98.4%</span>
                      </div>
                      <div className="flex justify-between border-b border-purple-100/50 pb-1">
                        <span>ANTI-FAKE VALIDATION</span>
                        <span className="text-brand-violet font-bold">Clean / Unique</span>
                      </div>
                      <div className="flex justify-between border-b border-purple-100/50 pb-1">
                        <span>AUTO-PRIORITY</span>
                        <span className="text-orange-600 font-bold uppercase">{priority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GPS MATCH</span>
                        <span className="text-slate-800 font-bold">{latitude}, {longitude}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[10px] text-slate-500 flex items-start gap-2 leading-relaxed">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>AI auto-detected landmarks. You may double-check and adjust parameters in the form before submitting.</span>
                  </div>
                </div>
              )}
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

              <div>
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
              </div>
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
}
