import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './articleview.css'; // Import the CSS file

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedArticle, setEditedArticle] = useState({ title: '', Content: '', Slug: '' });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:8055/items/Articles/${id}`);
        setArticle(response.data.data);
        setEditedArticle(response.data.data);
      } catch (error) {
        setError('Error fetching article: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDeleteArticle = async () => {
    try {
      await axios.delete(`http://localhost:8055/items/Articles/${id}`);
      navigate('/');
    } catch (error) {
      setError('Error deleting article: ' + error.message);
    }
  };

  const handleUpdateArticle = async () => {
    try {
      await axios.patch(`http://localhost:8055/items/Articles/${id}`, editedArticle);
      setEditing(false);
      const response = await axios.get(`http://localhost:8055/items/Articles/${id}`);
      setArticle(response.data.data);
    } catch (error) {
      setError('Error updating article: ' + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="articleview-error">{error}</div>;

  return (
    <div className="articleview-container">
      <h1 className="articleview-title">{article.title}</h1>
      <div className="articleview-content">
        <p><strong>Slug:</strong> {article.Slug}</p>
        <p>
          <strong>Content:</strong> <span dangerouslySetInnerHTML={{ __html: article.Content }} />
        </p>
      </div>

      {editing ? (
        <div className="article-form-container">
          <h2>Edit Article</h2>
          <input
            type="text"
            value={editedArticle.title}
            onChange={(e) => setEditedArticle({ ...editedArticle, title: e.target.value })}
            className="article-form-input"
          />
          <input
            type="text"
            value={editedArticle.Slug}
            onChange={(e) => setEditedArticle({ ...editedArticle, Slug: e.target.value })}
            className="article-form-input"
          />
          <textarea
            value={editedArticle.Content}
            onChange={(e) => setEditedArticle({ ...editedArticle, Content: e.target.value })}
            className="article-form-textarea"
          />
          <button onClick={handleUpdateArticle} className="articleview-button">Update</button>
          <button onClick={() => setEditing(false)} className="articleview-button">Cancel</button>
        </div>
      ) : (
        <div className="articleview-actions">
          <button onClick={() => setEditing(true)} className="articleview-button edit">Edit</button>
          <button onClick={handleDeleteArticle} className="articleview-button delete">Delete</button>
        </div>
      )}
    </div>
  );
};

export default ArticleView;