import { useState, useEffect } from 'react'
import { PenTool, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/data/routing/routes'

export function ConsentFormsPage() {
    const navigate = useNavigate()
    const [visitId, setVisitId] = useState<string | null>(null)

    useEffect(() => {
        // Get visit ID from sessionStorage
        const storedVisitId = sessionStorage.getItem('currentVisitId')
        if (storedVisitId) {
            setVisitId(storedVisitId)
            // Load existing consent status for this visit if available
            try {
                const consentData = sessionStorage.getItem(`consentFormsStatus-${storedVisitId}`)
                if (consentData) {
                    const consent = JSON.parse(consentData)
                    setConsentStates({
                        hipaa: consent.hipaa || false,
                        privacy: consent.privacy || false,
                        treatment: consent.treatment || false
                    })
                }
            } catch {
                // Keep default states
            }
        }
    }, [])
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        emailAddress: '',
        signatureDate: ''
    })

    const [consentStates, setConsentStates] = useState({
        hipaa: false,
        privacy: false,
        treatment: false
    })

    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [showLoadingModal, setShowLoadingModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleConsentChange = (field: string, checked: boolean) => {
        setConsentStates(prev => ({
            ...prev,
            [field]: checked
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Show confirmation modal instead of directly submitting
        setShowConfirmationModal(true)
    }

    const handleConfirmSubmit = () => {
        // Close confirmation modal
        setShowConfirmationModal(false)

        // Show loading modal
        setShowLoadingModal(true)

        // After 2 seconds, hide loading and show success
        setTimeout(() => {
            // Save consent status
            if (!visitId) {
                // If no visit ID, save to general location (fallback)
                const consentStatus = {
                    hipaa: consentStates.hipaa,
                    privacy: consentStates.privacy,
                    treatment: consentStates.treatment,
                    submitted: true,
                    submittedAt: new Date().toISOString()
                }
                sessionStorage.setItem('consentFormsStatus', JSON.stringify(consentStatus))
            } else {
                // Save consent status to sessionStorage for this specific visit
                const consentStatus = {
                    hipaa: consentStates.hipaa,
                    privacy: consentStates.privacy,
                    treatment: consentStates.treatment,
                    submitted: true,
                    submittedAt: new Date().toISOString()
                }
                sessionStorage.setItem(`consentFormsStatus-${visitId}`, JSON.stringify(consentStatus))
            }

            // Hide loading, show success
            setShowLoadingModal(false)
            setShowSuccessModal(true)

            // After 1 second, navigate to visit details
            setTimeout(() => {
                setShowSuccessModal(false)
                if (visitId) {
                    navigate(ROUTES.app.visitDetails.href.replace(':visitId', visitId))
                } else {
                    navigate('/visits')
                }
            }, 1000)
        }, 2000)
    }

    const handleCancel = () => {
        // Navigate back to visits dashboard
        navigate('/visits')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Full width without sidebar */}
            <header style={{
                backgroundColor: '#5538A6',
                color: 'white',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                    }}>
                        Porter Health - Patient Consent Forms
                    </h1>
                </div>
            </header>

            {/* Main Content - Full width layout */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Info Banner */}
                <div style={{
                    background: '#E6F7FF',
                    borderLeft: '4px solid #239BCF',
                    padding: '16px',
                    borderRadius: '4px',
                    marginBottom: '24px'
                }}>
                    <p className="text-sm sm:text-base text-gray-700">
                        <strong>Note:</strong> This is a placeholder consent form for demonstration purposes. No data is actually collected or saved.
                    </p>
                </div>

                {/* Patient Information Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-6">
                        Patient Information
                    </h2>

                    <div className="space-y-6">
                        {/* Full Name */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                placeholder="Enter your full legal name"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #EFEFEF',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                placeholder="mm/dd/yyyy"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #EFEFEF',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Email Address */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.emailAddress}
                                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                                placeholder="your.email@example.com"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #EFEFEF',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Required Consent Forms Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                        Required Consent Forms
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Please review and acknowledge each consent form below:
                    </p>

                    <div className="space-y-4 sm:space-y-6">
                        {/* HIPAA Authorization */}
                        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="hipaa"
                                    checked={consentStates.hipaa}
                                    onChange={(e) => handleConsentChange('hipaa', e.target.checked)}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="flex-1">
                                    <label htmlFor="hipaa" className="text-sm sm:text-base font-medium text-gray-900 cursor-pointer">
                                        HIPAA Authorization
                                    </label>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        I authorize Porter Health to use and disclose my protected health information for treatment, payment, and healthcare operations as described in the Notice of Privacy Practices.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Notice of Privacy Practices */}
                        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    checked={consentStates.privacy}
                                    onChange={(e) => handleConsentChange('privacy', e.target.checked)}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="flex-1">
                                    <label htmlFor="privacy" className="text-sm sm:text-base font-medium text-gray-900 cursor-pointer">
                                        Notice of Privacy Practices
                                    </label>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        I acknowledge that I have received and reviewed Porter Health's Notice of Privacy Practices, which describes how my medical information may be used and disclosed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Treatment Consent */}
                        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="treatment"
                                    checked={consentStates.treatment}
                                    onChange={(e) => handleConsentChange('treatment', e.target.checked)}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="flex-1">
                                    <label htmlFor="treatment" className="text-sm sm:text-base font-medium text-gray-900 cursor-pointer">
                                        Treatment Consent
                                    </label>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        I consent to receive medical treatment and healthcare services from Porter Health providers. I understand the nature of the services to be provided and potential risks involved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Electronic Signature Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                        Electronic Signature
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        By signing below, you acknowledge that you have read, understood, and agree to all consent forms listed above.
                    </p>

                    {/* Signature Area */}
                    <div style={{
                        border: '2px dashed #D1D5DB',
                        borderRadius: '8px',
                        padding: '40px',
                        marginBottom: '24px',
                        backgroundColor: '#FEF2F2',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                    }}>
                        <PenTool size={24} style={{ color: '#F97316', flexShrink: 0 }} />
                        <p className="text-sm text-gray-500" style={{ margin: 0 }}>
                            Digital signature functionality not available in this placeholder
                        </p>
                    </div>

                    {/* Date Field */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.signatureDate}
                            onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                            placeholder="mm/dd/yyyy"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #EFEFEF',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>

                {/* Disclaimer */}
                <div style={{
                    marginBottom: '32px'
                }}>
                    <p className="text-xs text-gray-500 text-center">
                        <strong>Disclaimer:</strong> This is a non-functional placeholder form for demonstration purposes only. In a production environment, this would be connected to Porter Health's consent management system and would securely store all patient acknowledgments and signatures in compliance with HIPAA regulations.
                    </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end" style={{
                    marginBottom: '32px'
                }}>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            width: '100%',
                            padding: '10px 24px',
                            border: '2px solid #5538A6',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#5538A6',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F3F4F6'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!(consentStates.hipaa || consentStates.privacy || consentStates.treatment)}
                        style={{
                            width: '100%',
                            padding: '10px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'white',
                            backgroundColor: '#5538A6',
                            cursor: (consentStates.hipaa || consentStates.privacy || consentStates.treatment) ? 'pointer' : 'not-allowed',
                            opacity: (consentStates.hipaa || consentStates.privacy || consentStates.treatment) ? 1 : 0.6,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (consentStates.hipaa || consentStates.privacy || consentStates.treatment) {
                                e.currentTarget.style.backgroundColor = '#462D8A'
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (consentStates.hipaa || consentStates.privacy || consentStates.treatment) {
                                e.currentTarget.style.backgroundColor = '#5538A6'
                            }
                        }}
                    >
                        Submit Consent Forms
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmationModal && (
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
                            setShowConfirmationModal(false)
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
                        {/* Title */}
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1b1b1b',
                            marginBottom: '12px'
                        }}>
                            Collected consent?
                        </h2>

                        {/* Conditionally show message based on all forms selected */}
                        {consentStates.hipaa && consentStates.privacy && consentStates.treatment ? (
                            <p style={{
                                fontSize: '14px',
                                color: '#4B5563',
                                lineHeight: '1.6',
                                marginBottom: '24px'
                            }}>
                                All consent forms have been collected.
                            </p>
                        ) : (
                            <>
                                {/* Description */}
                                <p style={{
                                    fontSize: '14px',
                                    color: '#4B5563',
                                    lineHeight: '1.6',
                                    marginBottom: '24px'
                                }}>
                                    Please verify that you have collected the required consent forms for this visit. You will not be able to begin this visit until all required consents have been obtained.
                                </p>

                                {/* Missing Consent Forms Section */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '12px',
                                        display: 'block'
                                    }}>
                                        Missing Consent Forms:
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'nowrap',
                                        gap: '8px',
                                        overflowX: 'auto',
                                        WebkitOverflowScrolling: 'touch'
                                    }}>
                                        {!consentStates.hipaa && (
                                            <button
                                                disabled
                                                style={{
                                                    padding: '8px 12px',
                                                    backgroundColor: '#DC2626',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    cursor: 'default',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0
                                                }}
                                            >
                                                HIPAA Authorization
                                            </button>
                                        )}
                                        {!consentStates.privacy && (
                                            <button
                                                disabled
                                                style={{
                                                    padding: '8px 12px',
                                                    backgroundColor: '#DC2626',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    cursor: 'default',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0
                                                }}
                                            >
                                                Notice of Privacy Practices
                                            </button>
                                        )}
                                        {!consentStates.treatment && (
                                            <button
                                                disabled
                                                style={{
                                                    padding: '8px 12px',
                                                    backgroundColor: '#DC2626',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    cursor: 'default',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0
                                                }}
                                            >
                                                Treatment Consent
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
                            width: '100%',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => setShowConfirmationModal(false)}
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
                                    minWidth: '80px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F3F4F6'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white'
                                }}
                            >
                                No
                            </button>
                            <button
                                onClick={handleConfirmSubmit}
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
                                    minWidth: '80px'
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

            {/* Loading Modal */}
            {showLoadingModal && (
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

            {/* Success Modal */}
            {showSuccessModal && (
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
                        {/* Success Icon */}
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
                            <CheckCircle size={32} color="#10B981" strokeWidth={3} />
                        </div>

                        {/* Success Message */}
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#1b1b1b',
                            margin: 0
                        }}>
                            Success!
                        </h2>

                        {/* Proceed Button */}
                        <button
                            onClick={() => {
                                setShowSuccessModal(false)
                                if (visitId) {
                                    navigate(ROUTES.app.visitDetails.href.replace(':visitId', visitId))
                                } else {
                                    navigate('/visits')
                                }
                            }}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#5538A6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                width: '100%',
                                marginTop: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#462D8A'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#5538A6'
                            }}
                        >
                            Proceed to Visit
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}