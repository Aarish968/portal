import { useIsAuthenticated, useMsal } from '@azure/msal-react'

function TestView() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  const handleLogin = () => {
    instance.loginPopup().catch(error => console.log(error))
  }

  const handleLogout = () => {
    instance.logout().catch(error => console.log(error))
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
      </div>
    )
  }
  else {
    return <button onClick={handleLogin}>Sign In</button>
  }
}

export default TestView
