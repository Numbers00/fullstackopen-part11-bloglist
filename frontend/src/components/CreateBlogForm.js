import { useState } from 'react';

const CreateBlogForm = (props) => {
  const [newBlog, setNewBlog] = useState({});

  const createBlog = e => {
    e.preventDefault();

    props.createBlog(newBlog);
    setNewBlog({ title: '', author: '', url: '' });
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <h2>create new</h2>
      <form onSubmit={createBlog} style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <label htmlFor='titleInput'>title:</label>&nbsp;
          <input
            id='titleInput'
            type='text'
            value={newBlog.title || ''}
            onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <label htmlFor='authorInput'>author:</label>&nbsp;
          <input
            id='authorInput'
            type='text'
            value={newBlog.author || ''}
            onChange={e => setNewBlog({ ...newBlog, author: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <label htmlFor='urlInput'>url:</label>&nbsp;
          <input
            id='urlInput'
            type='text'
            value={newBlog.url || ''}
            onChange={e => setNewBlog({ ...newBlog, url: e.target.value })}
          />
        </div>
      </form>
      <button type='button' onClick={createBlog}>Create</button>
    </div>
  );
};

export default CreateBlogForm;
