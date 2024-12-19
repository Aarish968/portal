import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { useState } from 'react'

function TestView() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [lambdaResponse, setLambdaResponse] = useState<any>(null)

  const handleLogin = () => {
    instance.loginPopup().catch(e => console.error(e))
  }

  const handleLogout = () => {
    instance.logout().catch(e => console.error(e))
  }

  const testLambda = async () => {
    try {
      const response = await fetch('https://9s7199pwv7.execute-api.us-east-2.amazonaws.com/prod/hra?username=esther@helloporter2.com', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      const data = await response.json()
      setLambdaResponse(data)
    }
    catch (error) {
      setLambdaResponse({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  if (isAuthenticated) {
    return (
      <div>
        {import.meta.env.MODE}
        <p>
          Welcome,
          {accounts[0]?.name}
        </p>
        <pre>{JSON.stringify(accounts[0], null, 2)}</pre>
        <button onClick={handleLogout}>Sign Out</button>

        <div className=":uno: mt-5">
          <button onClick={testLambda}>Test Lambda</button>
          {lambdaResponse && (
            <pre className=":uno: mt-2.5 rounded bg-gray-100 p-2.5">
              {JSON.stringify(lambdaResponse, null, 2)}
            </pre>
          )}
        </div>
      </div>
    )
  }
  else {
    return <button onClick={handleLogin}>Sign In</button>
  }
}

export default TestView
