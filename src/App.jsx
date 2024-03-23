import { useState } from 'react';
import './App.css';
import 'regenerator-runtime/runtime';
import { colorNameList } from 'color-name-list';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const colors = colorNameList.reduce((acc, curr) => {
  acc[curr.name.toLowerCase()] = curr.hex;
  return acc;
}, {});




const App = () => {
  const [color, setColor] = useState('white');
  const [inputColor, setInputColor] = useState('');
  const [manualColor, setManualColor] = useState('');
  const [showColors, setShowColors] = useState(false);
  const [showCommonColors, setShowCommonColors] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = (language) => {
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    analyzeTranscript(transcript.toLowerCase());
  };

  const analyzeTranscript = (transcript) => {
    const words = transcript.split(' ');
    for (let word of words) {
      if (colors[word] || colors[word === 'gray' ? 'grey' : '']) {
        setColor(colors[word] || colors[word === 'gray' ? 'grey' : '']);
        break;
      }
    }
  };

  const handleInputChange = (event) => {
    setInputColor(event.target.value);
    const colorName = event.target.value.toLowerCase();
    const colorValue = colors[colorName] || (colorName === 'gray' ? colors['grey'] : '');
    setManualColor(colorName);
    setColor(colorValue || 'white');
  };

  const toggleColorList = () => {
    setShowColors(!showColors);
  };

  const toggleCommonColorList = () => {
    setShowCommonColors(!showCommonColors);
  };

  const commonEnglishColors = [
    'Red', 'Blue', 'Green', 'Yellow', 'Orange',
    'Purple', 'Pink', 'White', 'Black', 'Brown',
    'Gray', 'Cyan', 'Magenta', 'Lime', 'Olive',
    'Teal', 'Maroon', 'Navy', 'Silver', 'Gold'
  ];


  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  return (
    <div className="container">
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <div className='btns'>
      <button onClick={startListening}>Start</button>
      <button onClick={stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      </div>
      <p>Color: {transcript}</p>
      <div className="color-box" style={{ backgroundColor: color }}></div>
      <input
        type="text"
        value={inputColor}
        onChange={handleInputChange}
        placeholder="Type a color name"
      />

      <button onClick={toggleColorList}>{showColors ? 'Hide' : 'Show'} Colors</button>
      {showColors && (
        <ul>
          {Object.keys(colors).map((colorName, index) => (
            <li key={index}>{colorName}</li>
          ))}
        </ul>
      )}

      <button onClick={toggleCommonColorList}>{showCommonColors ? 'Hide' : 'Show'} Common Colors</button>
      {showCommonColors && (
        <div>
          <h3>Common English Colors</h3>
          <ul>
            {commonEnglishColors.map((color, index) => (
              <li key={index}>{color}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
