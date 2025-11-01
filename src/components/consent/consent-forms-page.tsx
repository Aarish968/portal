import React, { useState } from 'react'

export function ConsentFormsPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        emailAddress: ''
    })

    const [consentStates, setConsentStates] = useState({
        hipaa: false,
        privacy: false,
        treatment: false
    })

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
                    background: '#F7FCFF',
                    borderLeft: '4px solid #239BCF',
                    padding: '16px',
                    borderRadius: '4px',
                    marginBottom: '24px'
                }}>
                    <p className="text-sm sm:text-base text-gray-700">
                        <strong>Note:</strong> This is a placeholder consent form for demonstration purposes No data is actually collected or<br />
                        saved.
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
                                placeholder="dd-mm-yyyy"
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
                                        I acknowledge that I have received and reviewed Porter Health's Notice of Privacy Practices, which describes how my health information may be used and disclosed.
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
                                        I consent to receive medical treatment and services from Porter Health providers. I understand the nature of the proposed treatment and any associated risks involved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!consentStates.hipaa || !consentStates.privacy || !consentStates.treatment}
                                className="w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Submit Consent Forms
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}