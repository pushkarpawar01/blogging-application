import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Latest Posts</h1>
      {posts.length === 0 ? (
        <div className="empty-state">
          <h2>No posts yet!</h2>
          <p>Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <Link to={`/post/${post._id}`} key={post._id}>
              <div className="card">
                <h2 className="card-title">{post.title}</h2>
                <div className="card-meta">
                  By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                  <span style={{ marginLeft: '1rem' }}>❤️ {post.likes?.length || 0}</span>
                  <span style={{ marginLeft: '1rem' }}>💬 {post.comments?.length || 0}</span>
                </div>
                <div className="card-excerpt">
                  {post.content.length > 150 
                    ? `${post.content.substring(0, 150)}...` 
                    : post.content}
                </div>
                <span style={{ color: 'var(--primary)', fontWeight: '500' }}>Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
