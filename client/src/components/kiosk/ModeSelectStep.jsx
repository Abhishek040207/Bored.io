import React from 'react';
import { FiActivity, FiFeather, FiCheck, FiVolume2, FiArrowRight } from 'react-icons/fi';
import { speechService } from '../../utils/speech';

const ModeSelectStep = ({ selectedMode, onSelectMode, language, onNext, onBack }) => {
  const isHindi = language === 'hi';

  const modes = [
    {
      id: 'ALLOPATHIC',
      title: isHindi ? 'सामान्य ओपीडी (Allopathic Medicine)' : 'General OPD (Allopathic)',
      badge: isHindi ? 'मुख्य चिकित्सा पद्धति' : 'Standard Clinical Intake',
      subtitle: isHindi
        ? 'आधुनिक चिकित्सा intake • SOCRATES लक्षण विश्लेषण (दर्द, बुखार, खांसी, बीपी आदि)'
        : 'Modern clinical intake • SOCRATES symptom progression & acute triage',
      icon: <FiActivity size={32} className="text-blue-400" />,
      features: isHindi
        ? ['SOCRATES दर्द व लक्षण विश्लेषण', 'आपातकालीन रेड-फ्लैग अलर्ट', 'दवा व एलर्जी इतिहास']
        : ['SOCRATES Pain & Symptom Progression', 'Emergency Red-Flag Screening', 'Medication & Allergy Profile'],
      accentColor: 'blue',
      audioText: isHindi
        ? 'सामान्य ओपीडी - आधुनिक चिकित्सा और लक्षणों के विस्तृत विश्लेषण के लिए इसे चुनें।'
        : 'General OPD - Select for standard allopathic medical consultation and symptom analysis.'
    },
    {
      id: 'AYUSH',
      title: isHindi ? 'आयुष / आयुर्वेदिक ओपीडी (AYUSH Mode)' : 'AYUSH / Ayurvedic OPD',
      badge: isHindi ? 'दशविध परीक्षा पद्धति' : 'Traditional Medicine',
      subtitle: isHindi
        ? 'दशविध परीक्षा • प्रकृति, अग्नि (पाचन), कोष्ठ (पेट), निद्रा व आहार-विहार का आकलन'
        : 'Dashavidha Pariksha • Prakriti, Agni (digestion), Koshtha, Nidra & Ahara-Vihara',
      icon: <FiFeather size={32} className="text-emerald-400" />,
      features: isHindi
        ? ['वात-पित्त-कफ प्रकृति निर्धारण', 'अग्नि व आहार शक्ति परीक्षा', 'आहार-विहार जीवनशैली विश्लेषण']
        : ['Vata-Pitta-Kapha Prakriti Assessment', 'Agni & Digestive Fire Evaluation', 'Dietary & Lifestyle Analysis'],
      accentColor: 'emerald',
      audioText: isHindi
        ? 'आयुष और आयुर्वेदिक ओपीडी - प्रकृति, पाचन अग्नि और आहार-विहार के विश्लेषण के लिए इसे चुनें।'
        : 'AYUSH Mode - Select for Ayurvedic consultation, Prakriti, and lifestyle assessment.'
    }
  ];

  const handlePlayVoice = (e, text) => {
    e.stopPropagation();
    speechService.speak(text, language);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Step Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          Step 4 • चिकित्सा पद्धति चयन / Clinical Mode Selection
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          {isHindi ? 'परामर्श श्रेणी चुनें' : 'Select Consultation Mode'}
        </h1>
        <p className="text-base text-slate-400 max-w-xl mx-auto font-light">
          {isHindi
            ? 'अपनी स्वास्थ्य आवश्यकता अनुसार सामान्य ओपीडी अथवा आयुष / आयुर्वेदिक ओपीडी चुनें'
            : 'Choose between General Allopathic OPD or AYUSH / Ayurvedic intake'}
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {modes.map((m) => {
          const isSelected = selectedMode === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`relative cursor-pointer rounded-3xl p-7 transition-all duration-300 border-2 transform active:scale-98 ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-850 to-slate-900 border-emerald-500 ring-4 ring-emerald-500/20 shadow-2xl shadow-emerald-500/10 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  {m.icon}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handlePlayVoice(e, m.audioText)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                    title="Read description aloud"
                  >
                    <FiVolume2 size={20} className="text-emerald-400" />
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

              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {m.badge}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2.5 tracking-tight">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {m.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                {m.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← {isHindi ? 'सहमति स्क्रीन पर वापस' : 'Back to Consent'}
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-80 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-lg shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
        >
          <span>{isHindi ? 'लक्षण जांच शुरू करें' : 'Start Intake Dialogue'}</span>
          <FiArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ModeSelectStep;
