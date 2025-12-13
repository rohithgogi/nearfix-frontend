import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

export default function ProviderReviewsSection({ providerId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [providerId, page]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/reviews/provider/${providerId}?page=${page}&size=5`
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/reviews/provider/${providerId}/stats`);

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <span style={{ color: '#ffc107', fontSize: '18px' }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  const renderRatingBar = (count, total) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div style={{
        height: '8px',
        background: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
        flex: 1
      }}>
        <div style={{
          height: '100%',
          background: '#ffc107',
          width: `${percentage}%`,
          transition: 'width 0.3s'
        }} />
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading && !stats) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading reviews...</div>;
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>⭐ Reviews & Ratings</h2>

      {stats && stats.totalReviews > 0 ? (
        <>
          {/* Rating Summary */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '30px' }}>
              {/* Overall Rating */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', fontWeight: '700', color: '#667eea' }}>
                  {stats.averageRating?.toFixed(1)}
                </div>
                <div style={{ fontSize: '28px', color: '#ffc107', marginBottom: '10px' }}>
                  {'★'.repeat(Math.round(stats.averageRating))}{'☆'.repeat(5 - Math.round(stats.averageRating))}
                </div>
                <div style={{ fontSize: '16px', color: '#666' }}>
                  {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Rating Breakdown */}
              <div>
                {[5, 4, 3, 2, 1].map((star) => {
                  const countKey = ['fiveStarCount', 'fourStarCount', 'threeStarCount', 'twoStarCount', 'oneStarCount'][5 - star];
                  const count = stats[countKey] || 0;
                  return (
                    <div key={star} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '10px'
                    }}>
                      <div style={{ width: '60px', fontSize: '14px', fontWeight: '600' }}>
                        {star} ★
                      </div>
                      {renderRatingBar(count, stats.totalReviews)}
                      <div style={{ width: '50px', fontSize: '14px', color: '#666', textAlign: 'right' }}>
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviews.map((review) => (
              <div key={review.id} style={{
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
                      {review.customerName}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#999' }}>
                    {formatDate(review.createdAt)}
                  </div>
                </div>

                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '10px',
                  padding: '12px',
                  background: '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  {review.serviceIcon} {review.serviceName}
                </div>

                {review.comment && (
                  <div style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: '#333'
                  }}>
                    "{review.comment}"
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '30px'
            }}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                style={{
                  padding: '10px 20px',
                  background: page === 0 ? '#e0e0e0' : '#667eea',
                  color: page === 0 ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                ← Previous
              </button>
              <div style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Page {page + 1} of {totalPages}
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                style={{
                  padding: '10px 20px',
                  background: page >= totalPages - 1 ? '#e0e0e0' : '#667eea',
                  color: page >= totalPages - 1 ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '15px' }}>⭐</div>
          <h3 style={{ margin: '10px 0', color: '#333' }}>No Reviews Yet</h3>
          <p style={{ color: '#666' }}>Be the first to review this provider!</p>
        </div>
      )}
    </div>
  );
}