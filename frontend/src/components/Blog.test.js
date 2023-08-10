import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    id: 'testid',
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0,
    user: { username: 'testuser', name: 'Test User' }
  };

  const likeBlog = jest.fn();
  const removeBlog = jest.fn();

  let container;
  beforeEach(() => {
    container = render(
      <Blog blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
    ).container;
  });

  const user = userEvent.setup();
  test('renders title and author but not url or likes by default', async () => {
    await screen.findByText(`${blog.title} ${blog.author}`);
    const urlAndLikesDiv = container
      .querySelector('div')
      .querySelector('div:nth-child(2)');

    expect(urlAndLikesDiv).toHaveStyle('display: none');
  });

  test('renders url and likes when show button is clicked', async () => {
    const urlAndLikesDiv = container
      .querySelector('div')
      .querySelector('div:nth-child(2)');

    expect(urlAndLikesDiv).toHaveStyle('display: none');

    const showButton = screen.getByText('Show');
    await user.click(showButton);

    expect(urlAndLikesDiv).not.toHaveStyle('display: none');
  });

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const likeButton = screen.getByText('Like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeBlog.mock.calls).toHaveLength(2);
  });
});
