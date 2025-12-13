import { useState } from 'react';

const API_BASE = 'http://localhost:8080';

export default function ReviewForm({ booking, onSuccess, onCancel }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters in your review');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          comment
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit review');
      }

      const review = await response.json();
      onSuccess(review);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div style={{ display: 'flex', gap: '8px', fontSize: '48px', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            style={{
              cursor: 'pointer',
              color: star <= (hoveredRating || rating) ? '#ffc107' : '#e0e0e0',
              transition: 'color 0.2s',
              userSelect: 'none'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getRatingText = () => {
    const texts = {
      1: '😞 Poor',
      2: '😕 Below Average',
      3: '😐 Average',
      4: '😊 Good',
      5: '😍 Excellent'
    };
    return texts[rating] || 'Tap to rate';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000
    }} onClick={onCancel}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }} onClick={(e) => e.stopPropagation()}>

        <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>⭐ Rate Your Experience</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          How was your service with <strong>{booking.providerBusinessName}</strong>?
        </p>

        <div style={{ marginBottom: '30px' }}>
          {renderStars()}
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: rating > 0 ? '#667eea' : '#999'
          }}>
            {getRatingText()}
          </div>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
            Share Your Feedback
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience with this service provider..."
            rows={5}
            maxLength={1000}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '2px solid #e0e0e0',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
            {comment.length} / 1000 characters
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            style={{
              flex: 1,
              padding: '14px',
              background: loading || rating === 0
                ? '#ccc'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || rating === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Submitting...' : '✅ Submit Review'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}