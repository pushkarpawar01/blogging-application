import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert(error.response?.data?.message || 'Error deleting post');
      }
    }
  };

  const handleLike = async () => {
    if (!user) return alert('Please login to like posts');
    try {
      const res = await axios.put(`/api/posts/like/${id}`);
      setPost({ ...post, likes: res.data });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/api/posts/comment/${id}`, { text: commentText });
      setPost({ ...post, comments: res.data });
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (!post) return <div className="empty-state">Post not found</div>;

  const hasLiked = user && post.likes && post.likes.includes(user.username);

  return (
    <div className="card" style={{ padding: '3rem' }}>
      <div className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="card-meta" style={{ fontSize: '1rem' }}>
          Written by <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{post.author}</span> • {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <div className="post-content">
        {post.content}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={handleLike} 
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: hasLiked ? 'rgba(99, 102, 241, 0.2)' : 'transparent' }}
        >
          {hasLiked ? '❤️' : '🤍'} Like ({post.likes?.length || 0})
        </button>
        <span style={{ color: 'var(--text-muted)' }}>{post.comments?.length || 0} Comments</span>
      </div>

      {user && user.username === post.author && (
        <div className="action-buttons">
          <Link to={`/edit/${post._id}`} className="btn">Edit Post</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </div>
      )}

      {/* Comments Section */}
      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Comments</h3>
        
        {user ? (
          <form onSubmit={handleComment} style={{ marginBottom: '2rem' }}>
            <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button type="submit" className="btn">Post</button>
            </div>
          </form>
        ) : (
          <div style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
            Please <Link to="/login" style={{ color: 'var(--primary)' }}>login</Link> to join the conversation.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!post.comments || post.comments.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 0' }}>No comments yet.</div>
          ) : (
            post.comments.map((comment, index) => (
              <div key={index} style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{comment.user}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div>{comment.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
