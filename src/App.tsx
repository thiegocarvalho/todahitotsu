import './App.css';
import Scanner from './components/Scanner';

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const cidFromUrl = queryParams.get('cid');

  return (
    <div className="app-container">
      {/* Background character image */}
      <img src="/images/site/hero1.png" alt="Hero background" className="hero-bg" />
      
      <Scanner initialCid={cidFromUrl} />
    </div>
  );
}

export default App;
