import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Chat from './components/Chat.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Chat />
      </main>
      <Footer />
    </div>
  );
}

export default App;
