import { useAuthStore } from '@/models/auth/stores/auth-store'

/**
 * Temporary debug component to display auth information
 * Remove this after debugging
 */
export function DebugAuthInfo() {
    const currentUser = useAuthStore(state => state.currentUser)
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const idToken = useAuthStore(state => state.idToken)

    if (process.env.NODE_ENV === 'production') {
        return null
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'white',
            border: '2px solid #5538A6',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '400px',
            maxHeight: '300px',
            overflow: 'auto',
            zIndex: 9999,
            fontSize: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#5538A6', fontSize: '14px', fontWeight: 'bold' }}>
                🔍 Auth Debug Info
            </h4>
            <div style={{ marginBottom: '8px' }}>
                <strong>Authenticated:</strong> {isAuthenticated ? '✓ Yes' : '✗ No'}
            </div>
            <div style={{ marginBottom: '8px' }}>
                <strong>Has Token:</strong> {idToken ? '✓ Yes' : '✗ No'}
            </div>
            <div style={{ marginBottom: '8px' }}>
                <strong>Username:</strong> {currentUser?.username || 'N/A'}
            </div>
            <div style={{ marginBottom: '8px' }}>
                <strong>Name:</strong> {currentUser?.name || 'N/A'}
            </div>
            <div style={{ marginBottom: '8px' }}>
                <strong>Preferred Username:</strong> {currentUser?.idTokenClaims?.preferred_username || 'N/A'}
            </div>
            <div style={{ marginBottom: '8px' }}>
                <strong>User ID:</strong> {currentUser?.id || 'N/A'}
            </div>
            <details style={{ marginTop: '12px' }}>
                <summary style={{ cursor: 'pointer', color: '#5538A6', fontWeight: 'bold' }}>
                    Full User Object
                </summary>
                <pre style={{
                    marginTop: '8px',
                    padding: '8px',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '10px'
                }}>
                    {JSON.stringify(currentUser, null, 2)}
                </pre>
            </details>
        </div>
    )
}
