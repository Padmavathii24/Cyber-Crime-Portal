import React, { useEffect, useState } from 'react';
import './NewsPage.css';

function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_GNEWS_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=cyber+crime&lang=en&country=in&max=10&apikey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        setArticles(data.articles);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [apiKey]);

  return (
    <div className="news-container">
      <h1 className="news-title">Latest Cyber Crime News</h1>

      {loading && <p className="news-loading">Loading news...</p>}
      {error && <p className="news-error">{error}</p>}

      <div className="news-grid">
        {articles.map((article, index) => (
          <div className="news-card" key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <img
                src={article.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt={article.title}
                className="news-image"
              />
              <div className="news-content">
                <h3 className="news-heading">{article.title}</h3>
                <p className="news-description">{article.description}</p>
                <p className="news-source">Source: {article.source.name}</p>
                <p className="news-date">{new Date(article.publishedAt).toLocaleString()}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsPage;
