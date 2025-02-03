import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Articles from './components/Article/Article';
import ArticleView from './components/ArticleView/ArticleView';
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <div className="blue-background">
      <Router>
        <Routes>
          <Route path="/" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleView />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;