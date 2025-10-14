interface AuthDisabledBannerProps {
  isAuthDisabled: boolean
}
function AuthDisabledBanner({ isAuthDisabled }: AuthDisabledBannerProps) {
  return (
    <>
      {isAuthDisabled && (
        <div className=":uno: bg-yellow-500 p-2 text-center text-black">
          Warning: Authentication is currently disabled
        </div>
      )}
    </>
  )
}

export default AuthDisabledBanner
