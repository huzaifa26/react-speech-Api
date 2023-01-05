import React, { useState, useEffect } from 'react';

let speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

speechRecognition = new speechRecognition();
speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = 'en-US';

const App = () => {
  const [transcripts, setTranscripts] = useState([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    speechRecognition.onstart = () => {
      setIsListening(true);
    };

    speechRecognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscripts((prevTranscripts) => {
            let newArr = [...prevTranscripts, transcript];
            newArr = newArr.join(',');
            newArr = newArr.replace(',', ' ');
            return [newArr];
          });
        }
      }
    };

    speechRecognition.onerror = (event) => {
      console.error(event.error);
    };

    speechRecognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      speechRecognition.stop();
    };
  }, []);

  const startListening = () => {
    speechRecognition.start();
  };

  const stopListening = () => {
    speechRecognition.stop();
  };

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Listening
      </button>
      <ul>
        {transcripts.map((transcript) => (
          <li key={transcript}>{transcript}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
