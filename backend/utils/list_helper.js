/* eslint-disable */
const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  }
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (max, blog) => {
    return max.likes > blog.likes ? max : blog;
  }
  return blogs.reduce(reducer);
};

const mostBlogs = (blogs) => {
  const blogsCount = _.countBy(blogs, (blog) => blog.author);
  const blogsCountEntries = Object.entries(blogsCount).map(([author, count]) => ({ 'author': author, 'count': count }));
  return _.maxBy(blogsCountEntries, 'count');
};

const mostLikes = (blogs) => {
  const mostLikedBlog = _.maxBy(blogs, 'likes');
  return { 'author': mostLikedBlog.author, 'likes': mostLikedBlog.likes };
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
};
