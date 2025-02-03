import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Article.css'; // Import the CSS file

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newArticle, setNewArticle] = useState({ title: '', Content: '', Slug: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8055/items/Articles');
        setArticles(response.data.data);
      } catch (error) {
        setError('Error fetching articles: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCreateArticle = async () => {
    try {
      await axios.post('http://localhost:8055/items/Articles', newArticle);
      
      // Alert the user that the article has been created
      alert('Article has been created successfully!');

      // Reset the form
      setNewArticle({ title: '', Content: '', Slug: '' });
      
      // Refresh the article list
      const response = await axios.get('http://localhost:8055/items/Articles');
      setArticles(response.data.data);
    } catch (error) {
      setError('Error creating article: ' + error.message);
    }
  };

  const handleViewArticle = (id) => {
    navigate(`/article/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="article-error">{error}</div>;

  return (
    <div className="article-container">
      <h1 className="article-title">Articles</h1>
      
      <div className="article-form-container">
        <h2>Create New Article</h2>
        <input
          type="text"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} 
          className="article-form-input"
        />
        <input
          type="text"
          placeholder="Slug"
          value={newArticle.Slug}
          onChange={(e) => setNewArticle({ ...newArticle, Slug: e.target.value })}
          className="article-form-input"
        />
        <textarea
          placeholder="Content"
          value={newArticle.Content}
          onChange={(e) => setNewArticle({ ...newArticle, Content: e.target.value })}
          className="article-form-textarea"
        />
        <button onClick={handleCreateArticle} className="article-form-button" data-testid="create-button">
          Create
        </button>
      </div>

      <h>Article List</h>
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article.id} className="article-list-item" data-testid="article-list-item">
            <h3>{article.title}</h3>
            <p><strong>Slug:</strong> {article.Slug}</p>
            <p>
              <strong>Content:</strong>{' '}
              <span dangerouslySetInnerHTML={{ __html: article.Content || article.Content }} />
            </p>
            <button onClick={() => handleViewArticle(article.id)} className="article-view-button" data-testid="view-button">
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Articles;
