const Post = require('../models/Post');

// Get all posts with pagination and filtering
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    let query = { isPublished: true };

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get all posts error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user._id, // Add the authenticated user as author
    };

    // 🎯 GENERATE SLUG IF NOT PROVIDED
    if (!postData.slug) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        .substring(0, 50) + '-' + Date.now();
    }

    const post = new Post(postData);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('category', 'name');

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get a single post by ID or slug
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    let post;
    if (isObjectId) {
      post = await Post.findById(id)
        .populate('author', 'username')
        .populate('category', 'name');
    } else {
      post = await Post.findOne({ slug: id })
        .populate('author', 'username')
        .populate('category', 'name');
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.json({
      success: true,
      post,
    });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to update this post' });
    }

    // 🎯 UPDATE SLUG IF TITLE CHANGED
    if (req.body.title && req.body.title !== post.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        .substring(0, 50) + '-' + Date.now();
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username').populate('category', 'name');

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (err) {
    console.error('Update post error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      content,
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('category', 'name')
      .populate('comments.user', 'username');

    res.json({
      success: true,
      post: populatedPost,
    });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(400).json({ error: err.message });
  }
}; 