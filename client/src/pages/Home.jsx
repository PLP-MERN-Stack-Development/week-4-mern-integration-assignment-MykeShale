import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { posts, loading, error, fetchPosts, fetchCategories, categories } = usePosts();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    fetchPosts(1, 10, e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // For now, we'll just filter locally
    // Later we can add search to the backend
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>Welcome to MERN Blog</h1>
        <p>Discover amazing stories and share your thoughts</p>
        
        {user && (
          <Link to="/create-post" className="btn btn-primary create-post-btn">
            ✍️ Create New Post
          </Link>
        )}
      </div>

      {/* 🎯 SEARCH AND FILTER */}
      <div className="filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <select 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/*  ERROR MESSAGE */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* 🎯 POSTS GRID */}
      <div className="posts-grid">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts yet</h3>
            <p>Be the first to create a post!</p>
            {user && (
              <Link to="/create-post" className="btn btn-primary">
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-image">
                <img 
                  src={post.featuredImage || '/default-post.jpg'} 
                  alt={post.title}
                  onError={(e) => {
                    e.target.src = '/default-post.jpg';
                  }}
                />
              </div>
              
              <div className="post-content">
                <div className="post-meta">
                  <span className="post-author">By {post.author?.username || 'Unknown'}</span>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>
                
                <h3 className="post-title">
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </h3>
                
                <p className="post-excerpt">
                  {post.excerpt || post.content.substring(0, 150)}...
                </p>
                
                <div className="post-footer">
                  <span className="post-category">{post.category?.name}</span>
                  <span className="post-views">👁️ {post.viewCount || 0} views</span>
                  <span className="post-comments">💬 {post.comments?.length || 0} comments</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home; 