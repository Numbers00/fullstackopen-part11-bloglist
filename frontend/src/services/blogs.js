import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = newBlog => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.post(baseUrl, newBlog, config);
  return request.then(response => response.data);
};

const update = async (id, newBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.put(`${baseUrl}/${id}`, newBlog, config);
  return request.then(response => response.data);
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.delete(`${baseUrl}/${id}`, config);
  return request.then(response => response.data);
};

export default { setToken, getAll, create, update, remove };
