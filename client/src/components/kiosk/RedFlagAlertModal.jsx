import React from 'react';
import { FiAlertTriangle, FiPhoneCall, FiUserCheck, FiArrowRight } from 'react-icons/fi';

const RedFlagAlertModal = ({ alertData, language, onAcknowledge }) => {
  const isHindi = language === 'hi';

  if (!alertData || !alertData.is_emergency) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-red-950/90 via-slate-900 to-slate-950 border-4 border-red-500 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl shadow-red-500/40 animate-bounceOnce">
        {/* Siren Icon & Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-red-600/30 border-4 border-red-500 flex items-center justify-center mx-auto text-red-400 animate-pulse">
            <FiAlertTriangle size={42} className="stroke-[2.5]" />
          </div>

          <div className="inline-block px-4 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/50">
            🚨 EMERGENCY TRIAGE INTERCEPT • आपातकालीन अलर्ट
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {isHindi ? 'आपातकालीन लक्षण पाए गए हैं!' : 'Critical Red-Flag Detected!'}
          </h2>

          <div className="text-base text-red-200 font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/30">
            {alertData.condition || 'Suspected Acute Cardiovascular / Stroke Emergency'}
          </div>
        </div>

        {/* Immediate Instructions */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-red-500/30 space-y-3 text-sm text-slate-300">
          <div className="flex items-center gap-3 text-white font-semibold text-base">
            <span className="w-7 h-7 rounded-full bg-red-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
              1
            </span>
            <span>
              {isHindi ? 'तुरंत आपातकालीन कक्ष / नर्स काउंटर पर जाएं' : 'Proceed directly to Emergency Triage Bay'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-white font-semibold text-base">
            <span className="w-7 h-7 rounded-full bg-red-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </span>
            <span>
              {isHindi ? 'ड्यूटी नर्स व डॉक्टर को अलर्ट भेज दिया गया है' : 'Stat alert dispatched to Staff Nurse & Physician'}
            </span>
          </div>

          <p className="text-xs text-slate-400 pt-1 border-t border-slate-800">
            {isHindi
              ? 'सिस्टम ने आपकी कतार प्राथमिकता को "उच्च प्राथमिकता / इमरजेंसी" में बदल दिया है। नियमित लाइन में प्रतीक्षा न करें।'
              : 'System has promoted patient to Priority 1 STAT triage queue. Do not wait in standard outpatient line.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onAcknowledge}
            className="flex-1 py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{isHindi ? 'समझ गया, आगे बढ़ें' : 'Acknowledge & Continue'}</span>
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedFlagAlertModal;
