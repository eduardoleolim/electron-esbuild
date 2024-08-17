import './App.css';
import electronLogo from './assets/electron-logo.svg';
import reactLogo from './assets/react-logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='App-header-logos'>
          <img src={electronLogo} className="App-logo" alt="React logo" /> 
          +
          <img src={reactLogo} className="App-logo" alt="Electron logo" />
        </div>
        <p>
          Edit <code>src/renderer/App.tsx</code> and save to reload.
        </p>

        <a
          className="App-link"
          href="https://www.electronjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Electron
        </a>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
