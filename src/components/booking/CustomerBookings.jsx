import { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import PaymentModal from './PaymentModal';

const API_BASE = 'http://localhost:8080';

const STATUS_CONFIG = {
  PENDING: { color: '#ffc107', bg: '#fff3cd', label: '⏳ Pending' },
  ACCEPTED: { color: '#28a745', bg: '#d4edda', label: '✅ Accepted' },
  REJECTED: { color: '#dc3545', bg: '#f8d7da', label: '❌ Rejected' },
  IN_PROGRESS: { color: '#17a2b8', bg: '#d1ecf1', label: '🔧 In Progress' },
  COMPLETED: { color: '#6c757d', bg: '#e2e3e5', label: '✓ Completed' },
  CANCELLED: { color: '#dc3545', bg: '#f8d7da', label: '✗ Cancelled' }
};

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [bookingReviews, setBookingReviews] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const url = filter === 'all'
        ? `${API_BASE}/api/bookings/customer`
        : `${API_BASE}/api/bookings/customer?status=${filter}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch bookings');

      const data = await response.json();
      setBookings(data);

      // Check payment status and reviews for completed bookings
      for (const booking of data) {
        if (booking.status === 'COMPLETED') {
          checkIfReviewed(booking.id);
          checkPaymentStatus(booking.id);
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfReviewed = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE}/api/reviews/booking/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const review = await response.json();
        setBookingReviews(prev => ({ ...prev, [bookingId]: review }));
      }
    } catch (error) {
      // Review doesn't exist, that's fine
    }
  };

  const checkPaymentStatus = async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE}/api/payments/status?bookingId=${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const status = await response.json();
        setPaymentStatus(prev => ({ ...prev, [bookingId]: status.status }));
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/bookings/${showCancelModal.id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (!response.ok) throw new Error('Failed to cancel booking');

      setShowCancelModal(null);
      setCancelReason('');
      fetchBookings();
    } catch (error) {
      alert('Error cancelling booking: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return (
      <span style={{ color: '#ffc107', fontSize: '16px' }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading bookings...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>📋 My Bookings</h1>

        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {['all', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '10px 20px',
                background: filter === status ? '#667eea' : 'white',
                color: filter === status ? 'white' : '#333',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
            </button>
          ))}
        </div>

        {bookings.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>📭</div>
            <h3 style={{ margin: '10px 0', color: '#333' }}>No Bookings Found</h3>
            <p style={{ color: '#666' }}>Your bookings will appear here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookings.map(booking => {
              const hasReview = bookingReviews[booking.id];
              const isPaid = paymentStatus[booking.id] === 'PAID';
              const canPay = booking.status === 'COMPLETED' && !isPaid;

              return (
                <div key={booking.id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                        Booking #{booking.id}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Created {formatDate(booking.createdAt)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: STATUS_CONFIG[booking.status]?.bg,
                        color: STATUS_CONFIG[booking.status]?.color
                      }}>
                        {STATUS_CONFIG[booking.status]?.label}
                      </div>
                      {isPaid && (
                        <div style={{
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          background: '#d4edda',
                          color: '#155724'
                        }}>
                          💳 Paid
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Service</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        {booking.serviceIcon} {booking.serviceName}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Provider</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        {booking.providerBusinessName}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {booking.providerPhone}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Scheduled</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        📅 {formatDate(booking.scheduledDateTime)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Price</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#667eea' }}>
                        ₹{booking.finalPrice || booking.quotedPrice}
                      </div>
                    </div>
                  </div>

                  {booking.description && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>Details</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {booking.description}
                      </div>
                    </div>
                  )}

                  {/* Payment Section */}
                  {booking.status === 'COMPLETED' && (
                    <div style={{
                      background: isPaid ? '#d4edda' : '#fff3cd',
                      padding: '15px',
                      borderRadius: '10px',
                      marginBottom: '15px'
                    }}>
                      {isPaid ? (
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '5px', color: '#155724' }}>
                            ✅ Payment Completed
                          </div>
                          <div style={{ fontSize: '14px', color: '#155724' }}>
                            Thank you for your payment!
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#856404' }}>
                            💳 Payment Pending
                          </div>
                          <div style={{ fontSize: '14px', color: '#856404', marginBottom: '10px' }}>
                            Service completed. Please proceed with payment.
                          </div>
                          <button
                            onClick={() => setShowPaymentModal(booking)}
                            style={{
                              padding: '10px 20px',
                              background: '#667eea',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '14px'
                            }}
                          >
                            💳 Pay Now - ₹{booking.finalPrice || booking.quotedPrice}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Section */}
                  {booking.status === 'COMPLETED' && isPaid && (
                    <div style={{
                      background: hasReview ? '#d4edda' : '#f0f0f0',
                      padding: '15px',
                      borderRadius: '10px',
                      marginBottom: '15px'
                    }}>
                      {hasReview ? (
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#155724' }}>
                            ⭐ Your Review
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            {renderStars(hasReview.rating)}
                          </div>
                          <div style={{ fontSize: '14px', color: '#155724' }}>
                            "{hasReview.comment}"
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            Reviewed on {formatDate(hasReview.createdAt)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                            ⭐ Share Your Experience
                          </div>
                          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                            How was your experience with this service?
                          </div>
                          <button
                            onClick={() => setShowReviewForm(booking)}
                            style={{
                              padding: '10px 20px',
                              background: '#667eea',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '14px'
                            }}
                          >
                            ⭐ Write Review
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {booking.cancellationReason && (
                    <div style={{
                      background: '#f8d7da',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>
                        Cancellation Reason:
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        {booking.cancellationReason}
                      </div>
                    </div>
                  )}

                  {booking.canBeCancelled && (
                    <button
                      onClick={() => setShowCancelModal(booking)}
                      style={{
                        padding: '10px 20px',
                        background: '#ff4757',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      ✗ Cancel Booking
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
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
          }} onClick={() => setShowCancelModal(null)}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ margin: '0 0 20px 0' }}>Cancel Booking #{showCancelModal.id}</h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  placeholder="Please provide a reason..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleCancelBooking}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#ff4757',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Confirm Cancellation
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(null);
                    setCancelReason('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#e0e0e0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            booking={showPaymentModal}
            onSuccess={(response) => {
              setShowPaymentModal(null);
              alert('✅ Payment Successful! Transaction ID: ' + response.razorpay_payment_id);
              fetchBookings();
            }}
            onCancel={() => setShowPaymentModal(null)}
          />
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewForm
            booking={showReviewForm}
            onSuccess={(review) => {
              setShowReviewForm(null);
              alert('✅ Thank you for your review!');
              fetchBookings();
            }}
            onCancel={() => setShowReviewForm(null)}
          />
        )}
      </div>
    </div>
  );
}