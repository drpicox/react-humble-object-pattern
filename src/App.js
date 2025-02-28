import React, { useState } from 'react';
import { Provider } from 'react-redux';
import './App.css';

// Plain implementations
import { HumbleSignupForm as PlainHumbleSignupForm } from './plain/components/HumbleSignupForm';
import { SmartSignupForm as PlainSmartSignupForm } from './plain/components/SmartSignupForm';

// Redux implementations
import { HumbleSignupForm as ReduxHumbleSignupForm } from './redux/components/HumbleSignupForm';
import { SmartSignupForm as ReduxSmartSignupForm } from './redux/components/SmartSignupForm';
import reduxStore from './redux/store';

function App() {
  const [implementation, setImplementation] = useState('plain');
  const [componentType, setComponentType] = useState('humble');

  // Determine which component to render based on user selection
  let FormComponent;
  if (implementation === 'plain') {
    FormComponent = componentType === 'humble' ? PlainHumbleSignupForm : PlainSmartSignupForm;
  } else {
    FormComponent = componentType === 'humble' ? ReduxHumbleSignupForm : ReduxSmartSignupForm;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Testing Strategies</h1>
        <h2>Analyzing Performance of Different Approaches</h2>
      </header>

      <div className="controls">
        <div>
          <h3>Implementation:</h3>
          <label>
            <input
              type="radio"
              name="implementation"
              value="plain"
              checked={implementation === 'plain'}
              onChange={() => setImplementation('plain')}
            />
            Plain React
          </label>
          <label>
            <input
              type="radio"
              name="implementation"
              value="redux"
              checked={implementation === 'redux'}
              onChange={() => setImplementation('redux')}
            />
            Redux
          </label>
        </div>

        <div>
          <h3>Component Type:</h3>
          <label>
            <input
              type="radio"
              name="componentType"
              value="humble"
              checked={componentType === 'humble'}
              onChange={() => setComponentType('humble')}
            />
            Humble Component
          </label>
          <label>
            <input
              type="radio"
              name="componentType"
              value="smart"
              checked={componentType === 'smart'}
              onChange={() => setComponentType('smart')}
            />
            Smart Component
          </label>
        </div>
      </div>

      <div className="form-container">
        <h3>
          {implementation === 'plain' ? 'Plain' : 'Redux'} {componentType === 'humble' ? 'Humble' : 'Smart'} Component
        </h3>
        {implementation === 'redux' ? (
          <Provider store={reduxStore}>
            <FormComponent />
          </Provider>
        ) : (
          <FormComponent />
        )}
      </div>
    </div>
  );
}

export default App;
