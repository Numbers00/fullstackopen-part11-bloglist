import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CreateBlogForm from './CreateBlogForm.js';

describe('<CreateBlogForm />', () => {
  const createBlog = jest.fn();

  beforeEach(() => {
    render(
      <CreateBlogForm createBlog={createBlog} />
    );
  });

  test('the form passes to the event handler the right arguments upon blog creation', async () => {
    const titleInput = screen.getByLabelText('title:');
    const authorInput = screen.getByLabelText('author:');
    const urlInput = screen.getByLabelText('url:');
    const createButton = screen.getByText('Create');

    const title = 'Test Title';
    const author = 'Test Author';
    const url = 'http://test.com';

    await userEvent.type(titleInput, title);
    await userEvent.type(authorInput, author);
    await userEvent.type(urlInput, url);
    await userEvent.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: title,
      author: author,
      url: url
    });
  });
});
