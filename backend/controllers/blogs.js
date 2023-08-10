const blogsRouter = require('express').Router();

const Blog = require('../models/blog.js');

const middleware = require('../utils/middleware.js');

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { id: 1, username: 1, name: 1 });
    res.json(blogs);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

blogsRouter.get('/:id', async (req, res) => {
  try {
    const blog = await Blog
      .findById(req.params.id)
      .populate('user', { id: 1, username: 1, name: 1 });
    res.json(blog);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  try {
    const body = req.body;
    if (!('title' in body) || !('url' in body)) {
      return res.status(400).end();
    }

    const user = req.user;

    const blog = new Blog({
      'title': body.title,
      'author': body.author,
      'url': body.url,
      'likes': body.likes || 0,
      'user': user.id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

blogsRouter.post('/:id/comments', middleware.userExtractor, async (req, res) => {
  try {
    const body = req.body;
    if (!body.comment || typeof body.comment !== 'string')
      return res.status(400).end();
    
    const comment = body.comment;
    const blog = await Blog.findById(req.params.id);
    blog.comments = [...blog.comments, comment];
    await blog.save();

    res.status(201).json(blog);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

blogsRouter.put('/:id', middleware.userExtractor, async (req, res) => {
  try {
    const body = req.body;
    if (!('title' in body) || !('url' in body)) {
      return res.status(400).end();
    }

    const blog = {
      'title': body.title,
      'author': body.author,
      'url': body.url,
      'likes': body.likes
    };
    await Blog.findByIdAndUpdate(
      req.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    );
    res.status(200).json(blog);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.user.toString() != req.user.id.toString()) {
      return res.status(401).json({ error: 'you are not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }  catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = blogsRouter;
