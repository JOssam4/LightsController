import React, { useState, useEffect } from 'react';
import { ColorPicker, useColor, toColor, Color} from 'react-color-palette';
import "react-color-palette/lib/css/styles.css";
import './App.css';

interface ColorResponse {
  h: number;
  s: number;
  v: number;
}

interface State {
  initialQueryCompleted: boolean;
}

function App() {
  const [state, setState] = useState<State>({
    initialQueryCompleted: false,
  });
  const [color, setColor] = useColor("hex", "#121212");

  function updateLights(color: Color) {
    const hsv = color.hsv;
    console.log(`sending request with hsv:`);
    console.dir(hsv);
    fetch('http://localhost:3001/color', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({color: hsv}),
    }).then((data) => console.log('done'));
  }

  useEffect(() => {
    fetch('http://localhost:3001/color')
      .then((resp) => resp.json())
      .then((currentColor: ColorResponse) => {
        const {h, s, v} = currentColor;
        setState({ initialQueryCompleted: true });
        setColor(toColor('hsv', {h, s, v}));
      });
  }, []);


  if (state.initialQueryCompleted) {
    return (
      <div className="App">
          <div>
            <ColorPicker width={456} color={color} onChange={setColor} onChangeComplete={(color) => updateLights(color)} dark />
          </div>
      </div>
    )
  }

  return (
    <div className="App">
    </div>
  );
}

export default App;
