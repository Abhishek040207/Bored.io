// Speech Synthesis (TTS) & Web Speech Recognition (STT) Utility for MediKiosk
// Enables dual-input voice interaction for low-literacy patient accessibility

class KioskSpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.supported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  // Text-To-Speech (TTS)
  speak(text, lang = 'hi-IN') {
    if (!this.synth || !text) return;

    try {
      this.synth.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95; // Slightly slower for low-literacy clarity
      utterance.pitch = 1.0;

      // Select natural Hindi/English voice if available
      const voices = this.synth.getVoices();
      const targetVoice = voices.find(v => 
        (lang === 'hi' && (v.lang.includes('hi') || v.name.includes('Hindi'))) ||
        (lang === 'en' && (v.lang.includes('en-IN') || v.lang.includes('en')))
      );
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Speech Recognition (STT)
  startListening({
    lang = 'hi-IN',
    onResult,
    onError,
    onEnd
  }) {
    if (!this.supported) {
      if (onError) onError('Browser speech recognition not supported. Please use touch options or Chrome/Edge.');
      return false;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (onResult) {
          onResult({
            final: finalTranscript,
            interim: interimTranscript,
            text: finalTranscript || interimTranscript
          });
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.warn('Speech recognition error:', event.error);
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      this.isListening = false;
      if (onError) onError(err.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop error
      }
      this.isListening = false;
    }
  }
}

export const speechService = new KioskSpeechService();
export default speechService;
