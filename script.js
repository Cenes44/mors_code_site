// Language translations
const translations = {
  en: {
    mainTitle: "Morse Code Trainer - Learn & Practice",
    mainDescription: "Learn and practice Morse code with interactive tools",
    converterTitle: "Text to Morse Converter",
    textLabel: "Normal Text:",
    morseLabel: "Morse Code:",
    playSoundText: "Play Sound",
    playSoundText: "Play Sound",
    playSoundText: "Play Sound",
    speedLabel: "Speed (WPM):",
    freqLabel: "Frequency (Hz):",
    vibrationLabel: "Vibration (Mobile):",
    themeLabel: "Dark Theme:",
    settingsTitle: "Settings",
    referenceTitle: "Morse Code Reference",
    exportTitle: "Import / Export",
    downloadAudioText: "Download Audio (WAV)",
    uploadLabel: "Upload Audio to Decode:",
    analyzeText: "Analyze & Decode",
    analysisComplete: "Analysis Complete",
    analysisError: "Error: ",
    invalidFileType: "Invalid file type. Please upload an audio file.",
    generatingAudio: "Generating...",
    analyzing: "Analyzing..."
  },
  tr: {
    mainTitle: "Mors Kodu Öğrenici - Uygulama ve Pratik",
    mainDescription: "Etkileşimli araçlarla Mors kodunu öğrenin ve pratik yapın",
    converterTitle: "Metinden Mors Koduna Dönüştürücü",
    textLabel: "Normal Metin:",
    morseLabel: "Mors Kodu:",
    playSoundText: "Ses Çal",
    playSoundText: "Ses Çal",
    playSoundText: "Ses Çal",
    speedLabel: "Hız (WPM):",
    freqLabel: "Frekans (Hz):",
    vibrationLabel: "Titreşim (Mobil):",
    themeLabel: "Koyu Tema:",
    settingsTitle: "Ayarlar",
    referenceTitle: "Mors Kodu Referansı",
    exportTitle: "İçe / Dışa Aktar",
    downloadAudioText: "Ses İndir (WAV)",
    uploadLabel: "Çözümlenecek Ses Dosyası Yükle:",
    analyzeText: "Analiz Et ve Çöz",
    analysisComplete: "Analiz Tamamlandı",
    analysisError: "Hata: ",
    invalidFileType: "Geçersiz dosya türü. Lütfen bir ses dosyası yükleyin.",
    generatingAudio: "Oluşturuluyor...",
    analyzing: "Analiz ediliyor..."
  }
};

// Morse Engine Class
class MorseEngine {
  constructor() {
    // Morse code mapping
    this.morseMap = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
      '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
      '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
      ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
      '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
    };

    // Initialize audio context
    this.ctx = null;
    this.initAudioContext();

    // Default settings
    this.wpm = 20; // Words per minute
    this.frequency = 600; // Frequency in Hz
    this.dotDuration = this.calculateDotDuration();

  }







  initAudioContext() {
    // Initialize audio context on user interaction to comply with autoplay policies
    const init = () => {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      document.body.removeEventListener('click', init);
      document.body.removeEventListener('touchstart', init);
    };

    document.body.addEventListener('click', init);
    document.body.addEventListener('touchstart', init);
  }

  calculateDotDuration() {
    // Standard formula: 1.2 / WPM seconds for a dot
    return (1.2 / this.wpm) * 1000; // Convert to milliseconds
  }

  updateSettings(wpm, frequency) {
    this.wpm = wpm;
    this.frequency = frequency;
    this.dotDuration = this.calculateDotDuration();
  }

  // Generate WAV file from morse code
  async generateWav(morseString) {
    if (!morseString) return null;

    try {
      // Calculate total duration
      const morseChars = morseString.split('');
      const dotMs = Number(this.dotDuration) || 60; // Fallback to 60ms

      let totalDuration = 0;
      for (const char of morseChars) {
        if (char === '.') totalDuration += dotMs * 2;
        else if (char === '-') totalDuration += dotMs * 4;
        else if (char === ' ') totalDuration += dotMs * 3;
        else if (char === '/') totalDuration += dotMs * 7;
        else totalDuration += dotMs;
      }
      totalDuration += 1000; // Extra padding

      // Create offline context
      const sampleRate = 44100;
      const offlineCtx = new OfflineAudioContext(1, Math.ceil(totalDuration / 1000 * sampleRate), sampleRate);

      // Render audio
      let startTime = 0;
      const dotSec = dotMs / 1000;

      for (const char of morseChars) {
        if (char === '.' || char === '-') {
          const duration = char === '.' ? dotSec : (dotSec * 3);

          const oscillator = offlineCtx.createOscillator();
          const gainNode = offlineCtx.createGain();

          oscillator.type = 'sine';
          oscillator.frequency.value = this.frequency;
          gainNode.gain.value = 0.5;

          oscillator.connect(gainNode);
          gainNode.connect(offlineCtx.destination);

          oscillator.start(startTime);
          oscillator.stop(startTime + duration);

          startTime += duration + dotSec; // sound + gap
        } else if (char === ' ') {
          startTime += dotSec * 2; // Wait 2 dots (already waited 1)
        } else if (char === '/') {
          startTime += dotSec * 6; // Wait 6 dots (already waited 1)
        }
      }

      const audioBuffer = await offlineCtx.startRendering();
      return this.bufferToWav(audioBuffer);
    } catch (e) {
      console.error("WAV Gen Error:", e);
      alert("Audio generation failed: " + e.message);
      return null;
    }
  }

  // Basic Audio Decoding
  async decodeAudioFromBuffer(arrayBuffer) {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    try {
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const threshold = 0.1;
      const chunkMs = 10;
      const samplesPerChunk = Math.floor(sampleRate * chunkMs / 1000);

      let state = 'OFF';
      let durations = [];
      let currentDuration = 0;

      for (let i = 0; i < channelData.length; i += samplesPerChunk) {
        let maxAmp = 0;
        for (let j = 0; j < samplesPerChunk && (i + j) < channelData.length; j++) {
          maxAmp = Math.max(maxAmp, Math.abs(channelData[i + j]));
        }

        const isSignal = maxAmp > threshold;

        if ((state === 'OFF' && isSignal) || (state === 'ON' && !isSignal)) {
          if (currentDuration > 0) {
            durations.push({ type: state, duration: currentDuration });
          }
          state = isSignal ? 'ON' : 'OFF';
          currentDuration = 0;
        }
        currentDuration += chunkMs;
      }
      if (currentDuration > 0) durations.push({ type: state, duration: currentDuration });

      const onDurations = durations.filter(d => d.type === 'ON' && d.duration > 20).map(d => d.duration);
      if (onDurations.length === 0) return "No signal detected";

      onDurations.sort((a, b) => a - b);
      const dotRef = onDurations[Math.floor(onDurations.length * 0.25)];
      const dashThreshold = dotRef * 2.2;

      let result = "";

      for (const d of durations) {
        if (d.type === 'ON') {
          if (d.duration < 20) continue;
          if (d.duration < dashThreshold) result += ".";
          else result += "-";
        } else {
          if (d.duration > dotRef * 5) result += " / ";
          else if (d.duration > dotRef * 2.2) result += " ";
        }
      }
      return result.trim();
    } catch (e) {
      console.error("Decoding error:", e);
      throw new Error("Could not decode audio.");
    }
  }

  // Convert AudioBuffer to WAV format
  bufferToWav(abuffer) {
    const numOfChan = abuffer.numberOfChannels;
    const length = abuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4);

    for (i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while (pos < abuffer.length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][pos]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(44 + offset, sample, true);
        offset += 2;
      }
      pos++;
    }

    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  encode(text) {
    if (!text) return '';

    return text.toUpperCase()
      .split('')
      .map(char => {
        if (char === ' ') return '/';
        return this.morseMap[char] || '';
      })
      .filter(code => code !== '')
      .join(' ');
  }

  decode(morse) {
    if (!morse) return '';

    return morse
      .split(' ')
      .map(code => {
        if (code === '/') return ' ';

        // Find the character that matches this morse code
        for (const [char, morseCode] of Object.entries(this.morseMap)) {
          if (morseCode === code) {
            return char;
          }
        }
        return '?'; // Unknown character
      })
      .join('');
  }

  async playSound(morseString) {
    if (!morseString || !this.ctx) return;

    // Resume audio context if suspended
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const morseChars = morseString.split('');

    for (let i = 0; i < morseChars.length; i++) {
      const char = morseChars[i];

      if (char === '.') {
        // Play dot sound
        await this.playTone(this.dotDuration);
        await this.sleep(this.dotDuration); // Space between dots/dashes
      } else if (char === '-') {
        // Play dash sound (3 times longer than dot)
        await this.playTone(this.dotDuration * 3);
        await this.sleep(this.dotDuration); // Space between dots/dashes
      } else if (char === ' ') {
        // Space between letters (3 dot durations)
        await this.sleep(this.dotDuration * 3);
      } else if (char === '/') {
        // Space between words (7 dot durations)
        await this.sleep(this.dotDuration * 7);
      } else {
        // Unknown character - just pause
        await this.sleep(this.dotDuration);
      }
    }
  }

  async playTone(duration) {
    if (!this.ctx) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = this.frequency;
    gainNode.gain.value = 0.2; // Volume control

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.start();
    await this.sleep(duration);
    oscillator.stop();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async playVibration(morseString) {
    if (!navigator.vibrate) return; // Vibration API not supported

    const morseChars = morseString.split('');

    for (let i = 0; i < morseChars.length; i++) {
      const char = morseChars[i];

      if (char === '.') {
        // Vibrate for dot duration
        navigator.vibrate(this.dotDuration);
        await this.sleep(this.dotDuration);
      } else if (char === '-') {
        // Vibrate for dash duration (3 times longer than dot)
        navigator.vibrate(this.dotDuration * 3);
        await this.sleep(this.dotDuration * 3);
      } else if (char === ' ') {
        // Pause between letters
        await this.sleep(this.dotDuration * 3);
      } else if (char === '/') {
        // Pause between words
        await this.sleep(this.dotDuration * 7);
      } else {
        // Unknown character - just pause
        await this.sleep(this.dotDuration);
      }
    }
  }

}


// Initialize the Morse Engine
const morseEngine = new MorseEngine();

// DOM Elements
const textInput = document.getElementById('textInput');
const morseOutput = document.getElementById('morseOutput');
const playSoundBtn = document.getElementById('playSoundBtn');
const answerInput = null;
const checkAnswerBtn = null;
const resultMessage = null;
const generatedContent = null;
const wpmSlider = document.getElementById('wpmSlider');
const wpmValue = document.getElementById('wpmValue');
const frequencySlider = document.getElementById('frequencySlider');
const freqValue = document.getElementById('freqValue');
const vibrationToggle = document.getElementById('vibrationToggle');
const themeToggle = document.getElementById('themeToggle');
const morseTableContainer = document.getElementById('morseTableContainer');
const downloadAudioBtn = document.getElementById('downloadAudioBtn');
const fileInput = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const uploadStatus = document.getElementById('uploadStatus');


// Current language
let currentLang = 'en';



// Initialize the app
function initApp() {
  // Load saved settings
  loadSettings();

  // Create morse reference table
  createMorseTable();

  // Set up event listeners
  setupEventListeners();

  // Apply theme
  applyTheme();



  // Set initial language
  updateLanguage(currentLang);
}

// Load saved settings from localStorage
function loadSettings() {
  const savedWpm = localStorage.getItem('morseWpm');
  const savedFreq = localStorage.getItem('morseFreq');
  const savedVibration = localStorage.getItem('morseVibration');
  const savedTheme = localStorage.getItem('morseTheme');
  const savedLang = localStorage.getItem('morseLang') || 'en';

  if (savedWpm) {
    wpmSlider.value = parseInt(savedWpm);
    wpmValue.textContent = savedWpm;
  }

  if (savedFreq) {
    frequencySlider.value = parseInt(savedFreq);
    freqValue.textContent = savedFreq;
  }

  if (savedVibration) {
    vibrationToggle.checked = savedVibration === 'true';
  }

  if (savedTheme) {
    themeToggle.checked = savedTheme === 'dark';
  }

  if (savedLang) {
    currentLang = savedLang;
    updateLanguage(currentLang);
  }

  // Update engine with loaded values
  morseEngine.updateSettings(parseInt(wpmSlider.value), parseInt(frequencySlider.value));
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('morseWpm', wpmSlider.value);
  localStorage.setItem('morseFreq', frequencySlider.value);
  localStorage.setItem('morseVibration', vibrationToggle.checked);
  localStorage.setItem('morseTheme', themeToggle.checked ? 'dark' : 'light');
  localStorage.setItem('morseLang', currentLang);
}

// Update language throughout the app
function updateLanguage(lang) {
  currentLang = lang;

  // Update language toggle buttons
  if (lang === 'tr') {
    langToggleTr.classList.add('active');
    langToggleEn.classList.remove('active');
  } else {
    langToggleEn.classList.add('active');
    langToggleTr.classList.remove('active');
  }

  // Update all text elements
  document.getElementById('mainTitle').textContent = translations[lang].mainTitle;
  document.getElementById('mainDescription').textContent = translations[lang].mainDescription;

  document.getElementById('converterTitle').textContent = translations[lang].converterTitle;
  document.getElementById('textLabel').textContent = translations[lang].textLabel;
  document.getElementById('morseLabel').textContent = translations[lang].morseLabel;
  document.getElementById('playSoundText').textContent = translations[lang].playSoundText;

  document.getElementById('speedLabel').textContent = translations[lang].speedLabel + ` ${wpmSlider.value}`;
  document.getElementById('freqLabel').textContent = translations[lang].freqLabel + ` ${frequencySlider.value}`;
  document.getElementById('vibrationLabel').textContent = translations[lang].vibrationLabel;
  document.getElementById('themeLabel').textContent = translations[lang].themeLabel;
  document.getElementById('settingsTitle').textContent = translations[lang].settingsTitle;
  document.getElementById('referenceTitle').textContent = translations[lang].referenceTitle;

  // Export/Import translations
  document.getElementById('exportTitle').textContent = translations[lang].exportTitle;
  document.getElementById('downloadAudioText').textContent = translations[lang].downloadAudioText;
  document.getElementById('uploadLabel').textContent = translations[lang].uploadLabel;
  document.getElementById('analyzeText').textContent = translations[lang].analyzeText;

  // Update morse table headers
  const thElements = document.querySelectorAll('#morseTableContainer th');
  if (thElements.length >= 2) {
    thElements[0].textContent = lang === 'tr' ? 'Harf' : 'Letter';
    thElements[1].textContent = lang === 'tr' ? 'Mors Kodu' : 'Morse Code';
  }

  // Update placeholder texts
  document.getElementById('textInput').placeholder = lang === 'tr'
    ? 'Mors koduna dönüştürmek için metin girin'
    : 'Enter text to convert to Morse code';





  saveSettings();
}

// Create morse reference table dynamically
function createMorseTable() {
  const table = document.createElement('table');

  // Create header
  const headerRow = document.createElement('tr');
  const letterHeader = document.createElement('th');
  letterHeader.textContent = currentLang === 'tr' ? 'Harf' : 'Letter';
  const morseHeader = document.createElement('th');
  morseHeader.textContent = currentLang === 'tr' ? 'Mors Kodu' : 'Morse Code';

  headerRow.appendChild(letterHeader);
  headerRow.appendChild(morseHeader);
  table.appendChild(headerRow);

  // Add morse mappings to table
  for (const [letter, morse] of Object.entries(morseEngine.morseMap)) {
    const row = document.createElement('tr');

    const letterCell = document.createElement('td');
    letterCell.textContent = letter;
    letterCell.dataset.morse = morse;

    const morseCell = document.createElement('td');
    morseCell.textContent = morse;
    morseCell.dataset.morse = morse;

    row.appendChild(letterCell);
    row.appendChild(morseCell);

    // Add click event to play sound
    letterCell.addEventListener('click', () => playMorseFromTable(morse));
    morseCell.addEventListener('click', () => playMorseFromTable(morse));

    table.appendChild(row);
  }

  morseTableContainer.appendChild(table);
}

// Play morse from table click
function playMorseFromTable(morse) {
  morseEngine.playSound(morse);

  // Also vibrate if enabled
  if (vibrationToggle.checked) {
    morseEngine.playVibration(morse);
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Text to morse conversion
  textInput.addEventListener('input', () => {
    const text = textInput.value;
    const morse = morseEngine.encode(text);
    morseOutput.value = morse;
  });

  // Morse to text conversion
  morseOutput.addEventListener('input', () => {
    const morse = morseOutput.value;
    const text = morseEngine.decode(morse);
    textInput.value = text;
  });

  // Play sound button
  playSoundBtn.addEventListener('click', () => {
    const morse = morseOutput.value;
    morseEngine.playSound(morse);

    // Also vibrate if enabled
    if (vibrationToggle.checked) {
      morseEngine.playVibration(morse);
    }
  });



  // Settings controls
  wpmSlider.addEventListener('input', () => {
    wpmValue.textContent = wpmSlider.value;
    document.getElementById('speedLabel').textContent = translations[currentLang].speedLabel + ` ${wpmSlider.value}`;
    morseEngine.updateSettings(parseInt(wpmSlider.value), morseEngine.frequency);
    saveSettings();
  });

  frequencySlider.addEventListener('input', () => {
    freqValue.textContent = frequencySlider.value;
    document.getElementById('freqLabel').textContent = translations[currentLang].freqLabel + ` ${frequencySlider.value}`;
    morseEngine.updateSettings(morseEngine.wpm, parseInt(frequencySlider.value));
    saveSettings();
  });

  vibrationToggle.addEventListener('change', saveSettings);

  themeToggle.addEventListener('change', () => {
    applyTheme();
    saveSettings();
  });

  // Language toggle
  langToggleTr.addEventListener('click', () => {
    updateLanguage('tr');
  });

  langToggleEn.addEventListener('click', () => {
    updateLanguage('en');
  });

  // Initially set the active button based on current language
  if (currentLang === 'tr') {
    langToggleTr.classList.add('active');
    langToggleEn.classList.remove('active');
  } else {
    langToggleEn.classList.add('active');
    langToggleTr.classList.remove('active');
  }


  // Keyboard support
  document.addEventListener('keydown', (e) => {
    // If user is typing in a text field, don't trigger shortcuts
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

    if (e.key === '.' || e.code === 'Space') {
      // Play dot
      morseEngine.playTone(morseEngine.dotDuration);
    } else if (e.key === '-' || e.key === '_') {
      // Play dash
      morseEngine.playTone(morseEngine.dotDuration * 3);
    }
  });

  // Helper functions for download
  function triggerDownload(blob, filename) {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  // Export Audio
  downloadAudioBtn.addEventListener('click', async () => {
    const morse = morseOutput.value;
    if (!morse) { alert('No Morse code to export!'); return; }

    const originalText = downloadAudioBtn.innerHTML;
    downloadAudioBtn.textContent = translations[currentLang].generatingAudio;
    try {
      const blob = await morseEngine.generateWav(morse);
      if (blob && blob.size > 0) {
        triggerDownload(blob, 'morse_code.wav');
      } else {
        throw new Error("Generated audio file is empty");
      }
    } catch (e) {
      console.error(e);
      alert('Error generating audio: ' + e.message);
    }
    downloadAudioBtn.innerHTML = originalText;
  });

  // Import / Analyze
  analyzeBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) { alert('Please select a file first'); return; }

    uploadStatus.textContent = translations[currentLang].analyzing;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        if (file.type.includes('audio') || file.name.toLowerCase().endsWith('.wav') || file.name.toLowerCase().endsWith('.mp3')) {
          const decodedMorse = await morseEngine.decodeAudioFromBuffer(arrayBuffer);
          morseOutput.value = decodedMorse;
          uploadStatus.textContent = translations[currentLang].analysisComplete;
        } else {
          uploadStatus.textContent = translations[currentLang].invalidFileType;
          return;
        }
        morseOutput.dispatchEvent(new Event('input'));
      } catch (err) {
        console.error(err);
        uploadStatus.textContent = translations[currentLang].analysisError + err.message;
      }
    };
    reader.onerror = () => {
      uploadStatus.textContent = "Error reading file";
    };
    reader.readAsArrayBuffer(file);
  });



  // Helper functions for download
  function triggerDownload(blob, filename) {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

    // Force click
    a.click();

    // Cleanup after delay
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  // Export Audio
  downloadAudioBtn.addEventListener('click', async () => {
    const morse = morseOutput.value;
    if (!morse) { alert('No Morse code to export!'); return; }

    const originalText = downloadAudioBtn.innerHTML;
    downloadAudioBtn.textContent = 'Generating...';
    try {
      const blob = await morseEngine.generateWav(morse);
      if (blob && blob.size > 0) {
        triggerDownload(blob, 'morse_code.wav');
      } else {
        throw new Error("Generated audio file is empty");
      }
    } catch (e) {
      console.error(e);
      alert('Error generating audio: ' + e.message + "\n\nNote: This feature may require running via a local server (http://) instead of file:// due to browser security policies.");
    }
    downloadAudioBtn.innerHTML = originalText;
  });




  // Import / Analyze
  analyzeBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) { alert('Please select a file first'); return; }

    uploadStatus.textContent = 'Analyzing...';

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        if (file.type.includes('audio') || file.name.toLowerCase().endsWith('.wav') || file.name.toLowerCase().endsWith('.mp3')) {
          const decodedMorse = await morseEngine.decodeAudioFromBuffer(arrayBuffer);
          morseOutput.value = decodedMorse;
          uploadStatus.textContent = "Analysis Complete";
        } else {
          uploadStatus.textContent = "Invalid file type. Please upload an audio file.";
          return;
        }
        // Trigger update
        morseOutput.dispatchEvent(new Event('input'));
      } catch (err) {
        console.error(err);
        uploadStatus.textContent = "Error: " + err.message;
      }
    };

    reader.onerror = () => {
      uploadStatus.textContent = "Error reading file";
    };

    reader.readAsArrayBuffer(file);
  });


}

// Apply theme based on toggle
function applyTheme() {
  if (themeToggle.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}





// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}