import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(id);
      setPost(response.post);
    } catch (err) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      await postService.addComment(post._id, { content: comment });
      setComment('');
      fetchPost(); // Refresh post to show new comment
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(post._id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <h2>Post Not Found</h2>
        <p>The post you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  const isAuthor = user && post.author?._id === user._id;

  return (
    <div className="post-detail-container">
      <article className="post-detail">
        {/* 🎯 POST HEADER */}
        <header className="post-header">
          <h1>{post.title}</h1>
          
          <div className="post-meta">
            <div className="author-info">
              <span className="author-name">By {post.author?.username || 'Unknown'}</span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
            
            <div className="post-stats">
              <span>👁️ {post.viewCount || 0} views</span>
              <span>💬 {post.comments?.length || 0} comments</span>
              <span className="category-tag">{post.category?.name}</span>
            </div>
          </div>

          {isAuthor && (
            <div className="author-actions">
              <button 
                onClick={() => navigate(`/edit-post/${post._id}`)}
                className="btn btn-primary"
              >
                Edit Post
              </button>
              <button 
                onClick={handleDeletePost}
                className="btn btn-danger"
              >
                Delete Post
              </button>
            </div>
          )}
        </header>

        {/* 🎯 POST IMAGE */}
        {post.featuredImage && (
          <div className="post-image">
            <img src={post.featuredImage} alt={post.title} />
          </div>
        )}

        {/* 🎯 POST CONTENT */}
        <div className="post-content">
          {post.excerpt && (
            <div className="post-excerpt">
              <p>{post.excerpt}</p>
            </div>
          )}
          
          <div className="post-body">
            {post.content}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* 🎯 COMMENTS SECTION */}
        <section className="comments-section">
          <h3>Comments ({post.comments?.length || 0})</h3>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submittingComment}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <a href="/login">Sign in</a> to leave a comment
            </p>
          )}

          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.user?.username || 'Anonymous'}
                    </span>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostDetail; 