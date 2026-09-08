import React from 'react';
import { FiCheck, FiVolume2 } from 'react-icons/fi';
import { speechService } from '../../utils/speech';

const LANGUAGES = [
  {
    id: 'hi',
    name: 'हिन्दी',
    englishName: 'Hindi',
    nativeGreeting: 'नमस्ते! कृपया अपनी भाषा चुनें',
    sampleAudio: 'नमस्ते, स्वास्थ्य सेवा कियोस्क में आपका स्वागत है।',
    accentColor: '#10B981',
    badge: 'प्राथमिक (Primary)'
  },
  {
    id: 'en',
    name: 'English',
    englishName: 'English',
    nativeGreeting: 'Welcome! Please select your language',
    sampleAudio: 'Welcome to Swasya MediKiosk clinical intake.',
    accentColor: '#3B82F6',
    badge: 'Official'
  },
  {
    id: 'mr',
    name: 'मराठी',
    englishName: 'Marathi',
    nativeGreeting: 'नमस्कार! आपली भाषा निवडा',
    sampleAudio: 'नमस्कार, स्वागत आहे.',
    accentColor: '#F59E0B',
    badge: 'प्रादेशिक (Regional)'
  },
  {
    id: 'bn',
    name: 'বাংলা',
    englishName: 'Bengali',
    nativeGreeting: 'স্বাগতম! আপনার ভাষা নির্বাচন করুন',
    sampleAudio: 'স্বাগতম, আপনার স্বাস্থ্য সেবায়।',
    accentColor: '#EC4899',
    badge: 'আঞ্চলিক (Regional)'
  }
];

const LanguageStep = ({ selectedLang, onSelectLanguage, onNext }) => {
  const handlePlayVoice = (e, langObj) => {
    e.stopPropagation();
    speechService.speak(langObj.sampleAudio, langObj.id);
  };

  const handleSelect = (langId) => {
    onSelectLanguage(langId);
    const lang = LANGUAGES.find(l => l.id === langId);
    if (lang) {
      speechService.speak(lang.sampleAudio, lang.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Step 1 • भाषा चयन / Language Selection
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Select Your Language
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto font-light">
          अपनी पसंदीदा भाषा चुनें या आवाज़ सुनने के लिए स्पीकर बटन दबाएं
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.id;
          return (
            <div
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 transform active:scale-98 border-2 ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-emerald-500 shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/20 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {lang.badge}
                  </span>
                  <div className="mt-3">
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                      {lang.name}
                    </div>
                    <div className="text-sm font-medium text-slate-400 mt-1">
                      {lang.englishName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handlePlayVoice(e, lang)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
                    title="Listen pronunciation"
                  >
                    <FiVolume2 size={22} className="text-emerald-400" />
                  </button>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                        : 'border-slate-600 bg-transparent'
                    }`}
                  >
                    {isSelected && <FiCheck size={16} className="stroke-[3]" />}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 italic">
                "{lang.nativeGreeting}"
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue CTA */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-80 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-lg shadow-xl shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
        >
          <span>आगे बढ़ें • Continue</span>
          <span className="text-xl">➔</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageStep;
