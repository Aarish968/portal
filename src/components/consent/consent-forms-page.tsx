import { useState, useEffect } from 'react'
import { PenTool } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Mock visit data - in real app this would come from API
const mockVisitsToday = [
  {
    id: '1',
    patientName: 'Jane Smith',
    time: '10:30AM',
    address: '1234 Main Street, Dayton, OH',
    insurance: 'UHC',
    status: 'not-started' as const,
    visitType: 'in-home' as const,
    procedures: [
      { name: 'A1C' },
      { name: 'Blood Pressure' },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'not-started' as const,
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '2',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    insurance: 'Aetna',
    status: 'not-started' as const,
    visitType: 'telehealth' as const,
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'in-progress' as const,
    consentForms: [
      { name: 'HIPAA Authorization', completed: true },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '3',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    insurance: 'Aetna',
    status: 'not-started' as const,
    visitType: 'telehealth' as const,
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'not-started' as const,
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '4',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    insurance: 'Aetna',
    status: 'not-started' as const,
    visitType: 'telehealth' as const,
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'in-progress' as const,
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices', completed: true },
      { name: 'Treatment Consent' },
    ],
  },
]

export function ConsentFormsPage() {
    const navigate = useNavigate()
    const [visitId, setVisitId] = useState<string | null>(null)

    useEffect(() => {
        // First check URL parameters for visitId
        const urlParams = new URLSearchParams(window.location.search)
        const urlVisitId = urlParams.get('visitId')
        
        // Then check sessionStorage as fallback
        const storedVisitId = sessionStorage.getItem('currentVisitId')
        
        // Use URL visitId if available, otherwise use sessionStorage
        const finalVisitId = urlVisitId || storedVisitId
        
        if (finalVisitId) {
            setVisitId(finalVisitId)
            // Update sessionStorage with the visitId for consistency
            sessionStorage.setItem('currentVisitId', finalVisitId)
            
            // If visit data is not in sessionStorage, try to find it from mock data
            let visitData = sessionStorage.getItem(`visit-${finalVisitId}`)
            if (!visitData) {
                // Find visit in mock data and store it
                const visit = mockVisitsToday.find(v => v.id === finalVisitId)
                if (visit) {
                    sessionStorage.setItem(`visit-${finalVisitId}`, JSON.stringify(visit))
                }
            }
            
            // Load existing consent status for this visit if available
            try {
                const consentData = localStorage.getItem(`consentFormsStatus-${finalVisitId}`)
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

    const [errors, setErrors] = useState({
        fullName: '',
        dateOfBirth: '',
        emailAddress: '',
        signatureDate: ''
    })

    // Removed showPageExpired state - no longer needed

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const handleConsentChange = (field: string, checked: boolean) => {
        setConsentStates(prev => ({
            ...prev,
            [field]: checked
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate required fields
        const newErrors = {
            fullName: '',
            dateOfBirth: '',
            emailAddress: '',
            signatureDate: ''
        }
        
        let hasErrors = false
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required'
            hasErrors = true
        }
        
        if (!formData.dateOfBirth.trim()) {
            newErrors.dateOfBirth = 'Date of Birth is required'
            hasErrors = true
        }
        
        if (!formData.emailAddress.trim()) {
            newErrors.emailAddress = 'Email Address is required'
            hasErrors = true
        } else {
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.emailAddress)) {
                newErrors.emailAddress = 'Please enter a valid email address'
                hasErrors = true
            }
        }
        
        if (!formData.signatureDate.trim()) {
            newErrors.signatureDate = 'Date is required'
            hasErrors = true
        }
        
        if (hasErrors) {
            setErrors(newErrors)
            return
        }
        
        // Save consent status immediately (use localStorage so it persists across tabs)
        const consentStatus = {
            hipaa: consentStates.hipaa,
            privacy: consentStates.privacy,
            treatment: consentStates.treatment,
            submitted: true,
            submittedAt: new Date().toISOString()
        }
        if (!visitId) {
            localStorage.setItem('consentFormsStatus', JSON.stringify(consentStatus))
        } else {
            localStorage.setItem(`consentFormsStatus-${visitId}`, JSON.stringify(consentStatus))
        }

        // Notify other tabs/windows about consent submission using localStorage event
        localStorage.setItem('consentSubmissionEvent', JSON.stringify({
            type: 'CONSENT_SUBMITTED',
            visitId: visitId,
            consentStatus: consentStatus,
            timestamp: Date.now()
        }))
        
        // Also try window.opener for direct parent-child communication
        if (window.opener) {
            window.opener.postMessage({ 
                type: 'CONSENT_SUBMITTED', 
                visitId: visitId,
                consentStatus: consentStatus 
            }, window.location.origin)
        }

        // After 3 seconds, show page expired message
        setTimeout(() => {
            // Replace the entire page content with expired message
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background-color: #f9fafb;
                    color: #374151;
                    text-align: center;
                    margin: 0;
                    padding: 20px;
                    box-sizing: border-box;
                ">
                    <div style="
                        background: white;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        max-width: 400px;
                        width: 100%;
                    ">
                        <div style="
                            width: 64px;
                            height: 64px;
                            background-color: #FEF2F2;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px auto;
                        ">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12,6 12,12 16,14"/>
                            </svg>
                        </div>
                        <h1 style="
                            font-size: 24px; 
                            margin: 0 0 12px 0;
                            font-weight: 600;
                            color: #1f2937;
                        ">
                            Page Expired
                        </h1>
                        <p style="
                            font-size: 16px; 
                            color: #6b7280;
                            margin: 0 0 20px 0;
                            line-height: 1.5;
                        ">
                            This consent form has expired for security reasons.
                        </p>
                        <p style="
                            font-size: 14px; 
                            color: #9ca3af;
                            margin: 0;
                        ">
                            You can safely close this tab.
                        </p>
                    </div>
                </div>
            `
            
            // Also try to close the window (works if opened by script)
            try {
                window.close()
            } catch (e) {
                // Silently fail if can't close
                console.log('Cannot close window automatically')
            }
        }, 3000)
    }

    // Remove handleConfirmSubmit as it's no longer needed

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
                                required
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                placeholder="Enter your full legal name"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.fullName ? '1px solid #DC2626' : '1px solid #EFEFEF',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                placeholder="mm/dd/yyyy"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.dateOfBirth ? '1px solid #DC2626' : '1px solid #EFEFEF',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                            />
                            {errors.dateOfBirth && (
                                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                            )}
                        </div>

                        {/* Email Address */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.emailAddress}
                                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                                placeholder="your.email@example.com"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.emailAddress ? '1px solid #DC2626' : '1px solid #EFEFEF',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit'
                                }}
                            />
                            {errors.emailAddress && (
                                <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
                            )}
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
                            required
                            value={formData.signatureDate}
                            onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                            placeholder="mm/dd/yyyy"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: errors.signatureDate ? '1px solid #DC2626' : '1px solid #EFEFEF',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                            }}
                        />
                        {errors.signatureDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.signatureDate}</p>
                        )}
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
                        disabled={!(consentStates.hipaa || consentStates.privacy || consentStates.treatment) || 
                                 !formData.fullName.trim() || 
                                 !formData.dateOfBirth.trim() || 
                                 !formData.emailAddress.trim() || 
                                 !formData.signatureDate.trim()}
                        style={{
                            width: '100%',
                            padding: '10px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'white',
                            backgroundColor: '#5538A6',
                            cursor: (consentStates.hipaa || consentStates.privacy || consentStates.treatment) && 
                                   formData.fullName.trim() && 
                                   formData.dateOfBirth.trim() && 
                                   formData.emailAddress.trim() && 
                                   formData.signatureDate.trim() ? 'pointer' : 'not-allowed',
                            opacity: (consentStates.hipaa || consentStates.privacy || consentStates.treatment) && 
                                    formData.fullName.trim() && 
                                    formData.dateOfBirth.trim() && 
                                    formData.emailAddress.trim() && 
                                    formData.signatureDate.trim() ? 1 : 0.6,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if ((consentStates.hipaa || consentStates.privacy || consentStates.treatment) && 
                                formData.fullName.trim() && 
                                formData.dateOfBirth.trim() && 
                                formData.emailAddress.trim() && 
                                formData.signatureDate.trim()) {
                                e.currentTarget.style.backgroundColor = '#462D8A'
                            }
                        }}
                        onMouseLeave={(e) => {
                            if ((consentStates.hipaa || consentStates.privacy || consentStates.treatment) && 
                                formData.fullName.trim() && 
                                formData.dateOfBirth.trim() && 
                                formData.emailAddress.trim() && 
                                formData.signatureDate.trim()) {
                                e.currentTarget.style.backgroundColor = '#5538A6'
                            }
                        }}
                    >
                        Submit Consent Forms
                    </button>
                </div>
            </div>

            {/* No page expired modal needed - page will close automatically */}
        </div>
    )
}