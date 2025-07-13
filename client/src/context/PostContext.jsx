import React, { createContext, useContext, useState } from 'react';
import { postService, categoryService } from '../services/api';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async (page = 1, limit = 10, category = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getAllPosts(page, limit, category);
      setPosts(response.posts);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.createPost(postData);
      setPosts(prev => [response.post, ...prev]);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.updatePost(id, postData);
      setPosts(prev => 
        prev.map(post => 
          post._id === id ? response.post : post
        )
      );
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await postService.deletePost(id);
      setPosts(prev => prev.filter(post => post._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    posts,
    categories,
    loading,
    error,
    fetchPosts,
    fetchCategories,
    createPost,
    updatePost,
    deletePost,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
}; 