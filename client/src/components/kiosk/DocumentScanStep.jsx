import React, { useState, useRef } from 'react';
import { FiCamera, FiUploadCloud, FiFileText, FiCheck, FiArrowRight, FiX } from 'react-icons/fi';

const DocumentScanStep = ({ language, onComplete, onSkip }) => {
  const isHindi = language === 'hi';
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProceed = () => {
    onComplete(selectedFile);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Step Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          Step 6 • दस्तावेज़ स्कैन / Document & Prescription Digitization
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          {isHindi ? 'पुरानी पर्ची या जांच रिपोर्ट स्कैन करें' : 'Upload Old Prescriptions & Reports'}
        </h1>
        <p className="text-base text-slate-400 max-w-xl mx-auto font-light">
          {isHindi
            ? 'यदि आपके पास पूर्व डॉक्टर की पर्ची या खून जांच रिपोर्ट है, तो कैमरा या स्कैनर के सामने रखें'
            : 'Optional: Upload existing prescriptions or lab reports for automated clinical timeline sorting'}
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl">
              <img
                src={previewUrl}
                alt="Document preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors"
                title="Remove image"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <FiCheck size={14} />
                <span>{selectedFile?.name || 'Document Ready for AI Digitizer'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A: Camera Capture */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-8 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-blue-500 text-center space-y-3 transition-all group active:scale-98"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 flex items-center justify-center mx-auto transition-colors">
                <FiCamera size={32} />
              </div>
              <div className="text-lg font-bold text-white group-hover:text-blue-300">
                {isHindi ? 'कैमरे से फोटो खींचें' : 'Take Camera Photo'}
              </div>
              <div className="text-xs text-slate-500">
                {isHindi ? 'पर्ची को कैमरे के सामने रखें' : 'Capture prescription using device camera'}
              </div>
            </button>

            {/* Option B: File Upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-8 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500 text-center space-y-3 transition-all group active:scale-98"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center mx-auto transition-colors">
                <FiUploadCloud size={32} />
              </div>
              <div className="text-lg font-bold text-white group-hover:text-emerald-300">
                {isHindi ? 'फ़ाइल अपलोड करें' : 'Upload Image / PDF'}
              </div>
              <div className="text-xs text-slate-500">
                {isHindi ? 'JPG, PNG या PDF रिपोर्ट' : 'Select from saved files or gallery'}
              </div>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={onSkip}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            {isHindi ? 'कोई पर्ची नहीं है (आगे बढ़ें) ➔' : 'I have no old records (Skip) ➔'}
          </button>

          {previewUrl && (
            <button
              type="button"
              onClick={handleProceed}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>{isHindi ? 'दस्तावेज़ जोड़ें और आगे बढ़ें' : 'Attach Document & Continue'}</span>
              <FiArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentScanStep;
