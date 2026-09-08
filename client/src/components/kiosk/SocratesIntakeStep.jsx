import React, { useState, useEffect, useRef } from 'react';
import { 
  FiMic, 
  FiMicOff, 
  FiVolume2, 
  FiArrowRight, 
  FiCheck, 
  FiAlertTriangle, 
  FiLoader, 
  FiSend,
  FiCornerDownLeft
} from 'react-icons/fi';
import { speechService } from '../../utils/speech';
import { kioskAPI } from '../../utils/api';
import RedFlagAlertModal from './RedFlagAlertModal';

const SocratesIntakeStep = ({
  sessionId,
  patient,
  mode,
  language,
  onComplete,
  onEmergencyTriggered
}) => {
  const isHindi = language === 'hi';

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [progressPercent, setProgressPercent] = useState(15);
  const [stepNumber, setStepNumber] = useState(1);
  const [totalSteps, setTotalSteps] = useState(10);
  const [loading, setLoading] = useState(false);
  const [customText, setCustomText] = useState('');

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  // Red Flag Alert state
  const [emergencyAlert, setEmergencyAlert] = useState(null);

  // Collected responses state
  const [conversationHistory, setConversationHistory] = useState([]);
  const [collectedData, setCollectedData] = useState({});
  const [chiefComplaint, setChiefComplaint] = useState('');

  // Initialize session question
  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      try {
        const res = await kioskAPI.startSession(patient, mode, language);
        if (res.question) {
          setCurrentQuestion(res.question);
          setProgressPercent(res.progress_percent || 15);
          playQuestionAudio(res.question);
        }
      } catch (err) {
        console.warn('Backend startSession fallback:', err);
        // Fallback initial question
        const fallbackQ = {
          step_key: 'chief_complaint',
          title_en: 'What is the primary reason for your hospital visit today?',
          title_hi: 'आज अस्पताल आने का आपका मुख्य कारण क्या है?',
          audio_en: 'Please tell us or tap your main symptom.',
          audio_hi: 'कृपया अपनी मुख्य तकलीफ बोलकर बताएं या नीचे दिए गए विकल्पों को छुएं।',
          input_type: 'chips',
          chips: [
            { id: 'chest_pain', icon: '🫀', text_en: 'Chest Pain / Pressure', text_hi: 'छाती या सीने में दर्द', value: 'Chest Pain' },
            { id: 'fever', icon: '🌡️', text_en: 'Fever & Body Chills', text_hi: 'बुखार और ठंड लगना', value: 'Fever' },
            { id: 'respiratory', icon: '🫁', text_en: 'Cough & Breathlessness', text_hi: 'खांसी और सांस फूलना', value: 'Breathlessness' },
            { id: 'abdominal', icon: '🤢', text_en: 'Stomach Pain / Acidity', text_hi: 'पेट दर्द और पाचन समस्या', value: 'Stomach Pain' },
            { id: 'headache', icon: '🤕', text_en: 'Severe Headache / Dizziness', text_hi: 'सिरदर्द और चक्कर आना', value: 'Severe Headache' },
            { id: 'joint_pain', icon: '🦵', text_en: 'Joint / Bone Pain', text_hi: 'जोड़ों या बदन में दर्द', value: 'Joint Pain' },
            { id: 'diabetes_bp', icon: '🩸', text_en: 'BP / Sugar Regular Checkup', text_hi: 'बीपी / शुगर नियमित जांच', value: 'BP Sugar Checkup' },
            { id: 'other', icon: '🩺', text_en: 'Other Health Issue', text_hi: 'अन्य स्वास्थ्य समस्या', value: 'Other Issue' }
          ]
        };
        setCurrentQuestion(fallbackQ);
        playQuestionAudio(fallbackQ);
      } finally {
        setLoading(false);
      }
    };

    initSession();
    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
    };
  }, []);

  const playQuestionAudio = (q) => {
    if (!q) return;
    const textToSpeak = isHindi
      ? (q.audio_hi || q.title_hi)
      : (q.audio_en || q.title_en);
    speechService.speak(textToSpeak, language);
  };

  // Submit an answer (from touch chip, voice transcript, or scale)
  const handleAnswer = async (answerValue) => {
    if (!answerValue || loading) return;

    speechService.stopSpeaking();
    speechService.stopListening();
    setIsListening(false);
    setLiveTranscript('');
    setCustomText('');

    // Save chief complaint if step 1
    if (!chiefComplaint) {
      setChiefComplaint(answerValue);
    }

    setCollectedData(prev => ({
      ...prev,
      [currentQuestion?.step_key || 'step']: answerValue
    }));

    setConversationHistory(prev => [
      ...prev,
      {
        question: isHindi ? currentQuestion?.title_hi : currentQuestion?.title_en,
        answer: answerValue
      }
    ]);

    setLoading(true);

    try {
      const res = await kioskAPI.sendMessage(sessionId, answerValue);

      // Check emergency red flag alert
      if (res.emergency_alert && res.emergency_alert.is_emergency) {
        setEmergencyAlert(res.emergency_alert);
        if (onEmergencyTriggered) {
          onEmergencyTriggered(res.emergency_alert);
        }
        speechService.speak(
          isHindi
            ? 'सावधान! आपातकालीन लक्षण का पता चला है। तत्काल डॉक्टर या नर्स काउंटर पर संपर्क करें।'
            : 'Alert! Critical emergency symptom detected. Proceed immediately to emergency triage.',
          language
        );
      }

      if (res.is_completed) {
        speechService.speak(
          isHindi ? 'आपका प्राथमिक परीक्षण पूरा हो गया है।' : 'Intake complete. Submitting for doctor review.',
          language
        );
        onComplete({
          collectedData: { ...collectedData, [currentQuestion?.step_key]: answerValue },
          chiefComplaint: chiefComplaint || answerValue,
          socrates_responses: res.socrates_data || collectedData
        });
        return;
      }

      if (res.question) {
        setCurrentQuestion(res.question);
        setProgressPercent(res.progress_percent || 50);
        setStepNumber(res.step_number || (stepNumber + 1));
        setTotalSteps(res.total_steps || totalSteps);
        playQuestionAudio(res.question);
      }
    } catch (err) {
      console.warn('Next question fallback:', err);
      // Fallback completion after 5 steps
      if (stepNumber >= 5) {
        onComplete({
          collectedData: { ...collectedData, [currentQuestion?.step_key]: answerValue },
          chiefComplaint: chiefComplaint || answerValue,
          socrates_responses: collectedData
        });
      } else {
        setStepNumber(prev => prev + 1);
        setProgressPercent(prev => Math.min(prev + 20, 90));
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle Microphone Voice Input
  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      if (liveTranscript) {
        handleAnswer(liveTranscript);
      }
    } else {
      speechService.stopSpeaking();
      setLiveTranscript('');
      const started = speechService.startListening({
        lang: language,
        onResult: (res) => {
          setLiveTranscript(res.text);
          setCustomText(res.text);
        },
        onError: (err) => {
          console.warn('Speech err:', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
      if (started) {
        setIsListening(true);
      } else {
        setSpeechSupported(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4">
      {/* Emergency Alert Modal */}
      {emergencyAlert && (
        <RedFlagAlertModal
          alertData={emergencyAlert}
          language={language}
          onAcknowledge={() => setEmergencyAlert(null)}
        />
      )}

      {/* Progress Bar & Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white uppercase tracking-wider">
              {mode === 'AYUSH' ? '🌿 AYUSH Dashavidha Pariksha' : '🩺 SOCRATES Clinical Intake'}
            </span>
          </div>
          <span>
            {isHindi ? `प्रश्न ${stepNumber} / ${totalSteps}` : `Question ${stepNumber} of ${totalSteps}`}
          </span>
        </div>

        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md mb-6">
          {/* Question Title & Audio Button */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                {currentQuestion.step_key?.replace('_', ' ').toUpperCase()}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mt-3 leading-snug">
                {isHindi ? currentQuestion.title_hi : currentQuestion.title_en}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => playQuestionAudio(currentQuestion)}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors shrink-0 active:scale-95 shadow-lg"
              title="Repeat audio prompt"
            >
              <FiVolume2 size={26} />
            </button>
          </div>

          {/* DUAL INPUT OPTION A: High-Contrast Large Touch Cards */}
          {currentQuestion.chips && currentQuestion.chips.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {currentQuestion.chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  disabled={loading}
                  onClick={() => handleAnswer(chip.value || (isHindi ? chip.text_hi : chip.text_en))}
                  className="group relative p-5 rounded-2xl bg-slate-950/80 hover:bg-gradient-to-br hover:from-slate-900 hover:to-slate-800 border-2 border-slate-800 hover:border-emerald-500 text-left transition-all duration-200 transform active:scale-98 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                      {chip.icon || '👉'}
                    </span>
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {isHindi ? chip.text_hi : chip.text_en}
                      </div>
                      {isHindi && chip.text_en && (
                        <div className="text-xs text-slate-500 font-medium">
                          {chip.text_en}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500 text-slate-400 group-hover:text-slate-950 flex items-center justify-center transition-colors shrink-0">
                    <FiArrowRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* DUAL INPUT OPTION B: Live Voice Microphone Section */}
          <div className="pt-6 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Pulsing Mic Button */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  disabled={loading}
                  className={`relative p-5 rounded-2xl flex items-center justify-center text-white transition-all transform active:scale-95 shadow-xl ${
                    isListening
                      ? 'bg-red-600 ring-8 ring-red-500/30 animate-pulse'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak your answer'}
                >
                  {isListening ? (
                    <FiMic size={28} className="animate-bounce" />
                  ) : (
                    <FiMic size={28} />
                  )}
                </button>

                <div>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <span>{isListening ? (isHindi ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now') : (isHindi ? 'या बोलकर उत्तर दें' : 'Or Speak Your Answer')}</span>
                    {isListening && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isHindi
                      ? 'माइक दबाएं और हिंदी या अंग्रेजी में अपनी बात कहें'
                      : 'Tap mic button and speak in Hindi or English'}
                  </div>
                </div>
              </div>

              {/* Free Text Input Fallback */}
              <div className="flex items-center gap-2 w-full sm:w-80">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customText.trim()) {
                      handleAnswer(customText.trim());
                    }
                  }}
                  placeholder={isHindi ? 'लिखकर उत्तर दें...' : 'Type answer...'}
                  className="flex-1 py-3 px-4 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => customText.trim() && handleAnswer(customText.trim())}
                  disabled={!customText.trim() || loading}
                  className="p-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 rounded-xl font-bold transition-all shrink-0"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </div>

            {/* Live speech transcription display */}
            {liveTranscript && (
              <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-300 text-sm italic animate-fadeIn">
                "{liveTranscript}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center gap-3 text-slate-400 py-3">
          <FiLoader className="animate-spin text-emerald-400 text-xl" />
          <span className="text-sm">
            {isHindi ? 'AI लक्षण विश्लेषण व अगला प्रश्न तैयार हो रहा है...' : 'AI analyzing symptoms and adapting next question...'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SocratesIntakeStep;
