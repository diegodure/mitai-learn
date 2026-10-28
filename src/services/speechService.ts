// Interfaz para las voces
export interface SpeechOptions {
  text: string;
  lang?: string; // 'es-PY' para español paraguayo, o 'gn' para guaraní (si está disponible)
  rate?: number; // Velocidad (0.1 a 10)
  pitch?: number; // Tono (0 a 2)
  volume?: number; // Volumen (0 a 1)
}

export const speechService = {
  speak: (options: SpeechOptions) => {
    if (!('speechSynthesis' in window)) {
      console.warn('❌ Tu navegador no soporta síntesis de voz.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(options.text);
    
    // Forzamos un lang genérico para que el navegador sepa que es español
    utterance.lang = options.lang || 'es-ES'; 
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1.2;
    utterance.volume = options.volume ?? 1;

    const speakWithVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
      
      console.log('🎙️ Voces en español encontradas:', spanishVoices.map(v => `${v.name} (${v.lang})`));

      // 1. Intentar encontrar una voz de Latinoamérica (es-419, es-MX, es-US, etc.)
      const latinVoice = spanishVoices.find(v => 
        v.lang.includes('419') || 
        v.lang.includes('MX') || 
        v.lang.includes('US') || 
        v.lang.includes('AR') || 
        v.lang.includes('PY')
      );

      // 2. Si no hay latina, usar cualquier español que NO sea de España (es-ES)
      const anySpanishNotSpain = spanishVoices.find(v => v.lang !== 'es-ES');

      // 3. Si no queda otra, usar la voz de España
      const fallbackVoice = spanishVoices.find(v => v.lang === 'es-ES') || spanishVoices[0];

      const selectedVoice = latinVoice || anySpanishNotSpain || fallbackVoice;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('✅ Voz seleccionada:', selectedVoice.name, `(${selectedVoice.lang})`);
      } else {
        console.warn('⚠️ No se encontró ninguna voz en español.');
      }
      
      utterance.onstart = () => console.log('▶️ Audio iniciado');
      utterance.onend = () => console.log('⏹️ Audio terminado');
      utterance.onerror = (e) => console.error('❌ Error de audio:', e);

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      speakWithVoice();
    } else {
      console.log('⏳ Esperando a que carguen las voces...');
      window.speechSynthesis.onvoiceschanged = () => {
        speakWithVoice();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  },
  stop: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};