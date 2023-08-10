import PropTypes from 'prop-types';

import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';

import Blog from './components/Blog';
import CreateBlogForm from './components/CreateBlogForm';

import blogService from './services/blogs';
import loginService from './services/login';


const Togglable = forwardRef((props, refs) => {
  const [isVisible, setIsVisible] = useState(false);

  const showWhenVisible = { display: isVisible ? '' : 'none' };
  const hideWhenVisible = { display: isVisible ? 'none' : '' };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    };
  });

  return (
    <>
      <div style={hideWhenVisible}>
        <button type='button' onClick={() => setIsVisible(true)}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <button type='button' onClick={() => setIsVisible(false)}>Hide &quot;{props.buttonLabel}&quot;</button>
        {props.children}
      </div>
    </>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};
Togglable.displayName = 'Togglable';

const LoginForm = (props) => {
  const {
    login,
    username, setUsername,
    password, setPassword,
  } = props;

  return (
    <form onSubmit={login}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <label htmlFor='usernameInput'>username</label>&nbsp;
        <input
          id='usernameInput'
          type='text'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <label htmlFor='passwordInput'>password</label>&nbsp;
        <input
          id='passwordInput'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
};


const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user.user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs || []));
  }, []);

  const login = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username, password
      });

      blogService.setToken(user.token);

      setUser(user.user);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Wrong username or password');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const createBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      createdBlog.user = user;

      blogFormRef.current.toggleVisibility();

      setBlogs(blogs.concat(createdBlog));
      setSuccessMessage(`Added ${createdBlog.title} by ${createdBlog.author}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to create blog');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const likeBlog = async (id, blog) => {
    try {
      const likedBlog = {
        ...blog,
        likes: blog.likes + 1
      };

      await blogService.update(id, likedBlog);
      setBlogs(blogs.map(b => b.id === id ? likedBlog : b));
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to like blog');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const removeBlog = async (id, blog) => {
    try {
      const isConfirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`);
      if (!isConfirmed) return;

      await blogService.remove(id);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to remove blog');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
        <LoginForm
          login={login}
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button type='button' onClick={logout}>Logout</button>
      </p>
      { successMessage && <span style={{ color: 'green' }}>{successMessage}</span> }
      { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
      <Togglable buttonLabel={'Create Blog'} ref={blogFormRef}>
        <CreateBlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <div style={{ marginBottom: 8 }}>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} user={user} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
        )}
      </div>
    </div>
  );
};

export default App;