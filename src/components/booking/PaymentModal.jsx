import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

export default function PaymentModal({ booking, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const token = localStorage.getItem('token');

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setError('Failed to load Razorpay. Please refresh and try again.');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError('Razorpay is still loading. Please wait...');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch(`${API_BASE}/api/payments/create-order?bookingId=${booking.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(errorText || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NearFix',
        description: orderData.description,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.customerName,
          contact: orderData.customerPhone
        },
        theme: {
          color: '#667eea'
        },
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await fetch(`${API_BASE}/api/payments/verify?bookingId=${booking.id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            onSuccess(response);
          } catch (err) {
            setError('Payment verification failed: ' + err.message);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
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

        <div style={{ fontSize: '64px', marginBottom: '20px' }}>💳</div>

        <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Complete Payment</h2>

        <p style={{ color: '#666', marginBottom: '30px' }}>
          Pay for your service with <strong>{booking.providerBusinessName}</strong>
        </p>

        <div style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
            Service
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
            {booking.serviceIcon} {booking.serviceName}
          </div>

          <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
            Total Amount
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
            ₹{booking.finalPrice || booking.quotedPrice}
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
            onClick={handlePayment}
            disabled={loading || !razorpayLoaded}
            style={{
              flex: 1,
              padding: '14px',
              background: loading || !razorpayLoaded
                ? '#ccc'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !razorpayLoaded ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Processing...' : razorpayLoaded ? '💳 Pay Now' : '⏳ Loading...'}
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

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#e8f4fd',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#0066cc'
        }}>
          🔒 Payments are securely processed by Razorpay
        </div>
      </div>
    </div>
  );
}