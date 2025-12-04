import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080';

const ProviderProfileForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    city: '',
    pincode: '',
    latitude: '',
    longitude: '',
    bio: '',
    workingHours: '{}',
    experienceYears: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/provider/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);

      // Populate form with existing data
      if (response.data) {
        setFormData({
          businessName: response.data.businessName || '',
          address: response.data.address || '',
          city: response.data.city || '',
          pincode: response.data.pincode || '',
          latitude: response.data.latitude || '',
          longitude: response.data.longitude || '',
          bio: response.data.bio || '',
          workingHours: response.data.workingHours || '{}',
          experienceYears: response.data.experienceYears || ''
        });

        if (response.data.photoUrl) {
          setPhotoPreview(`${API_BASE}/api/files${response.data.photoUrl}`);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDocumentChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
          setLoading(false);
        },
        (error) => {
          setError('Unable to get location: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleStepSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (currentStep === 1) {
        // Submit business details and location
        await axios.put(
          `${API_BASE}/api/provider/profile`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Upload photo
        if (photoFile) {
          const photoFormData = new FormData();
          photoFormData.append('file', photoFile);

          await axios.post(
            `${API_BASE}/api/provider/profile/photo`,
            photoFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        }
        setCurrentStep(3);
      } else if (currentStep === 3) {
        // Upload document
        if (documentFile) {
          const docFormData = new FormData();
          docFormData.append('file', documentFile);

          await axios.post(
            `${API_BASE}/api/provider/profile/document`,
            docFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        }

        // Refresh profile and complete
        await fetchProfile();
        if (onComplete) onComplete();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.businessName && formData.address && formData.city &&
             formData.pincode && formData.latitude && formData.longitude;
    }
    if (currentStep === 2) {
      return photoFile || profile?.photoUrl;
    }
    if (currentStep === 3) {
      return documentFile || profile?.aadharUrl;
    }
    return false;
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                width: '30%',
                height: '8px',
                borderRadius: '4px',
                background: step <= currentStep ? '#667eea' : '#e0e0e0',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
        <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
          Step {currentStep} of 3
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Step 1: Business Details & Location */}
      {currentStep === 1 && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Business Details</h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="ABC Plumbing Services"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main Street, Landmark"
              rows={3}
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Mumbai"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="400001"
                maxLength="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Location *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Latitude"
                step="0.000001"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Longitude"
                step="0.000001"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '10px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              📍 Use My Current Location
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell customers about your expertise..."
              rows={3}
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Experience (Years)
            </label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleInputChange}
              placeholder="5"
              min="0"
              max="50"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '16px'
              }}
            />
          </div>
        </div>
      )}

      {/* Step 2: Photo Upload */}
      {currentStep === 2 && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Profile Photo</h2>

          <div style={{
            border: '2px dashed #667eea',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {photoPreview ? (
              <div>
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    borderRadius: '12px',
                    marginBottom: '15px'
                  }}
                />
                <div>
                  <label style={{
                    padding: '10px 20px',
                    background: '#667eea',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📸</div>
                <label style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  fontWeight: '600'
                }}>
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Document Upload */}
      {currentStep === 3 && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Identity Proof</h2>

          <div style={{
            border: '2px dashed #667eea',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {documentFile || profile?.aadharUrl ? (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
                <p style={{ fontWeight: '600', marginBottom: '10px' }}>
                  {documentFile ? documentFile.name : 'Document Uploaded'}
                </p>
                <label style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-block'
                }}>
                  Change Document
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
                <label style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  fontWeight: '600'
                }}>
                  Upload Aadhar / ID
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
                  PDF or Image (max 5MB)
                </p>
              </div>
            )}
          </div>

          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              ℹ️ Your documents are securely stored and will only be used for verification purposes.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: '#e0e0e0',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleStepSubmit}
          disabled={loading || !canProceed()}
          style={{
            flex: 2,
            padding: '14px',
            background: canProceed() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: canProceed() ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Saving...' : currentStep === 3 ? 'Complete Profile' : 'Continue →'}
        </button>
      </div>

      {currentStep < 3 && (
        <button
          onClick={() => {
            if (onComplete) onComplete();
          }}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Skip for now
        </button>
      )}
    </div>
  );
};

export default ProviderProfileForm;