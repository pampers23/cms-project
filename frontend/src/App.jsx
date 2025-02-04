import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Articles from './components/Article/Article';
import ArticleView from './components/ArticleView/ArticleView';
import Navbar from './components/LandingPage/Navbar/Navbar';
import Home from './components/LandingPage/Home/Home';
import About from './components/LandingPage/About/About';
import Features from './components/LandingPage/Features/Features';
import './App.css';

const App = () => {
  return (
    <div className="blue-background">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleView />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
