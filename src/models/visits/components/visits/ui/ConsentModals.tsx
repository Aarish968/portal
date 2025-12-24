import { CheckCircle } from 'lucide-react'
import { PendingConsentData, Visit } from '../../../types/types'


interface ConsentModalsProps {
  showConsentModal: boolean
  showConsentConfirmation: boolean
  showConsentLoading: boolean
  showConsentSuccess: boolean
  pendingConsentData: PendingConsentData | null
  currentVisits: Visit[]
  onCloseConsentModal: () => void
  onCloseConsentConfirmation: () => void
  onConsentConfirmation: () => void
  onCollectConsent: () => void
  onRetryCheck: () => void
}

export function ConsentModals({
  showConsentModal,
  showConsentConfirmation,
  showConsentLoading,
  showConsentSuccess,
  pendingConsentData,
  // currentVisits,
  onCloseConsentModal,
  onCloseConsentConfirmation,
  onConsentConfirmation,
  onCollectConsent,
  onRetryCheck
}: ConsentModalsProps) {
  return (
    <>
      {/* Consent Modal */}
      {showConsentModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onCloseConsentModal()
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#DC2626',
              marginBottom: '12px'
            }}>
              Consent Document Not Found.
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#4B5563',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              We weren't able to confirm the patient's consent. This may be due to a delay in data syncing, or the document may not have been uploaded yet.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              width: '100%',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={onCollectConsent}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: '#5538A6',
                  border: '1px solid #5538A6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                Collect Consent
              </button>
              <button
                onClick={onRetryCheck}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#5538A6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#462D8A'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#5538A6'
                }}
              >
                Retry Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consent Confirmation Modal */}
      {showConsentConfirmation && pendingConsentData && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onCloseConsentConfirmation()
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1b1b1b',
              marginBottom: '12px'
            }}>
              Collected consent?
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#4B5563',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Please verify that you have collected the required consent forms for this visit. You will not be able to begin this visit until all required consents have been obtained.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Missing Consent Forms:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {!pendingConsentData.consentStatus.hipaa && (
                  <span style={{
                    backgroundColor: 'rgb(207, 35, 35)',
                    color: 'rgb(255, 255, 255)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    HIPAA Authorization
                  </span>
                )}
                {!pendingConsentData.consentStatus.privacy && (
                  <span style={{
                    backgroundColor: 'rgb(207, 35, 35)',
                    color: 'rgb(255, 255, 255)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Notice of Privacy Practices
                  </span>
                )}
                {!pendingConsentData.consentStatus.treatment && (
                  <span style={{
                    backgroundColor: 'rgb(207, 35, 35)',
                    color: 'rgb(255, 255, 255)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Treatment Consent
                  </span>
                )}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              width: '100%',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={onCloseConsentConfirmation}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'rgb(207, 35, 35)',
                  border: '1px solid rgb(207, 35, 35)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF5F5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                No
              </button>
              <button
                onClick={onConsentConfirmation}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#5538A6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#462D8A'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#5538A6'
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consent Loading Modal */}
      {showConsentLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '4px solid #E5E7EB',
                borderTop: '4px solid #5538A6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <p style={{
              fontSize: '16px',
              color: '#1b1b1b',
              fontWeight: '500',
              margin: 0
            }}>
              Processing...
            </p>
          </div>
        </div>
      )}

      {/* Consent Success Modal */}
      {showConsentSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1002,
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle size={32} style={{ color: '#059669' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1b1b1b',
                margin: '0 0 8px 0'
              }}>
                Success!
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                Consent forms have been collected successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
