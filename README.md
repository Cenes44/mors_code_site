# Interactive Morse Code Trainer

An interactive web application to learn and practice Morse code. Built with vanilla HTML5, CSS3, and JavaScript ES6+ using the Web Audio API for sound generation.

## Live Demo
 *(Link will be available once deployed)*

## Features

- **Bidirectional Text/Morse Converter**: Instantly convert between text and Morse code
- **Interactive Practice Mode**: Generate random letters/words to practice decoding
- **Morse Code Reference Table**: Complete reference with clickable characters
- **Audio Playback**: Listen to Morse code with adjustable speed and frequency
- **Visual Flashing**: Visual representation of Morse code with flashing animation
- **Keyboard Shortcuts**: Use Space/Dot for (.) and Dash/Hyphen for (-)
- **Adjustable Settings**: Control speed (WPM), frequency, and vibration
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **PWA Support**: Installable on mobile devices for offline use
- **Dark/Light Theme**: Toggle between dark and light themes

## Technologies Used

- HTML5
- CSS3 (with custom properties and responsive design)
- JavaScript ES6+
- Web Audio API for sound generation
- Vibration API for tactile feedback
- LocalStorage for saving user preferences
- Service Workers for PWA functionality

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No external dependencies or build tools required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/morse-code-trainer.git
```

2. Navigate to the project directory:
```bash
cd morse-code-trainer
```

3. Open `index.html` in your web browser

### Manual Setup

Alternatively, you can download the files directly:

1. Download the ZIP file from the repository
2. Extract the contents
3. Open `index.html` in your web browser

## How to Use

### Text to Morse Conversion

1. Type text in the "Normal Text" field
2. See the corresponding Morse code appear in the "Morse Code" field
3. Click "Play Sound" to hear the Morse code
4. Click "Flash Light" to see a visual representation

### Morse to Text Conversion

1. Type Morse code in the "Morse Code" field using dots (.) and dashes (-)
2. See the corresponding text appear in the "Normal Text" field

### Practice Mode

1. Click "Generate Random Character/Word" to get a random item to decode
2. Enter the Morse code equivalent in the input field
3. Click "Check Answer" to see if your answer is correct

### Keyboard Shortcuts

- **.** or **Space**: Play Dot (.)
- **-** or **_**: Play Dash (-)

### Settings

- Adjust the speed (WPM) to control how fast the Morse code plays
- Change the frequency (Hz) to adjust the pitch of the tones
- Enable/disable vibration for tactile feedback
- Toggle between dark and light themes

## Project Structure

```
morse-code-trainer/
├── index.html          # Main HTML file with all modules
├── style.css           # Responsive CSS with modern design
├── script.js           # Core JavaScript functionality
├── sw.js               # Service worker for PWA
├── manifest.json       # PWA manifest file
├── icons/              # Icon files for PWA
│   ├── icon-192.png
│   └── icon-512.png
└── README.md           # This file
```

## Browser Compatibility

- Chrome 55+ (Web Audio API support)
- Firefox 53+ (Web Audio API support)
- Safari 11+ (Web Audio API support)
- Edge 79+ (Web Audio API support)

Note: Vibration API is only available on mobile devices and some browsers.

## Future Enhancements
- Add statistics and progress tracking
- Implement multiplayer or social features
- Add more visual themes and customization options
- Create lessons for beginners to advanced users

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
MIT

## Acknowledgments
- Morse code reference based on international standards

## Development Notes

This project was built with the following principles:

- Pure client-side functionality (no server required)
- All resources included in the project (no external CDN dependencies)
- Optimized for GitHub Pages deployment
- Mobile-first responsive design
- Progressive Web App capabilities
- Accessible interface design