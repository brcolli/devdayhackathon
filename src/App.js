import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import awsconfig from './src/aws-exports.js';


Amplify.configure(awsconfig);

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const invokeLambda = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await Amplify.post('api1cce71f3', '/prompt', {
        body: {
          prompt: "Hello"
        }
      });
      setResult(response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to My App
        </p>
        <button onClick={invokeLambda} disabled={loading}>
          {loading ? "Loading..." : "Trigger Lambda Function"}
        </button>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
    </div>
  );
}

export default App;
