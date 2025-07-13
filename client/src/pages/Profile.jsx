import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { posts, fetchPosts } = usePosts();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      await fetchPosts();
      // Filter posts by current user
      const filtered = posts.filter(post => post.author?._id === user?._id);
      setUserPosts(filtered);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
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
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
            <p>Member since {formatDate(user?.createdAt)}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>{userPosts.length}</h3>
          <p>Posts</p>
        </div>
        <div className="stat-card">
          <h3>{userPosts.reduce((total, post) => total + (post.viewCount || 0), 0)}</h3>
          <p>Total Views</p>
        </div>
        <div className="stat-card">
          <h3>{userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)}</h3>
          <p>Total Comments</p>
        </div>
      </div>

      <div className="profile-content">
        <h3>Your Posts</h3>
        
        {userPosts.length === 0 ? (
          <div className="no-posts">
            <h4>No posts yet</h4>
            <p>Start writing to see your posts here!</p>
          </div>
        ) : (
          <div className="user-posts">
            {userPosts.map(post => (
              <div key={post._id} className="user-post-card">
                <div className="post-header">
                  <h4>{post.title}</h4>
                  <span className={`post-status ${post.isPublished ? 'published' : 'draft'}`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <p className="post-excerpt">
                  {post.excerpt || post.content.substring(0, 100)}...
                </p>
                
                <div className="post-meta">
                  <span>Created: {formatDate(post.createdAt)}</span>
                  <span>Views: {post.viewCount || 0}</span>
                  <span>Comments: {post.comments?.length || 0}</span>
                </div>
                
                <div className="post-actions">
                  <button className="btn btn-small btn-primary">Edit</button>
                  <button className="btn btn-small btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 