import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useForm } from 'react-hook-form';

interface SuccessStory {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

const SuccessStoryAdmin: React.FC = () => {
  const supabase = useSupabaseClient();
  const { register, handleSubmit, reset } = useForm<SuccessStory>();
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);

  const fetchSuccessStories = async () => {
    console.log('Fetching success stories...');
    const { data, error } = await supabase
      .from('success_stories')
      .select('*');
    if (error) {
      console.error('Error fetching success stories:', error);
    } else {
      console.log('Success stories fetched:', data);
      setSuccessStories(data);
    }
  };

  const onSubmit = async (data: SuccessStory) => {
    console.log('Submitting success story:', data);
    const { error } = await supabase
      .from('success_stories')
      .insert([data]);
    if (error) {
      console.error('Error adding success story:', error);
    } else {
      console.log('Success story added:', data);
      reset();
      fetchSuccessStories();
    }
  };

  useEffect(() => {
    console.log('Component mounted, fetching success stories...');
    fetchSuccessStories();
  }, []);

  return (
    <div>
      <h1>Success Story Admin</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title</label>
          <input {...register('title')} />
        </div>
        <div>
          <label>Content</label>
          <textarea {...register('content')} />
        </div>
        <div>
          <label>Author</label>
          <input {...register('author')} />
        </div>
        <div>
          <label>Date</label>
          <input type="date" {...register('date')} />
        </div>
        <button type="submit">Add Success Story</button>
      </form>
      <div>
        <h2>Success Stories</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Author</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {successStories.length > 0 ? (
              successStories.map((story) => (
                <tr key={story.id}>
                  <td>{story.title}</td>
                  <td>{story.content}</td>
                  <td>{story.author}</td>
                  <td>{story.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No success stories available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p>SuccessStoryAdmin component rendered</p>
    </div>
  );
};

export default SuccessStoryAdmin;