import './App.css';
import Scanner from './components/Scanner';

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const cidFromUrl = queryParams.get('cid');

  return (
    <main className="app-container">
      {/* Background character image */}
      <img src={`${import.meta.env.BASE_URL}images/site/hero1.png`} alt="Hero background" className="hero-bg" />
      
      <Scanner initialCid={cidFromUrl} />
    </main>
  );
}

export default App;
