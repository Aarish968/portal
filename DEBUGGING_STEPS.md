# Debugging Steps - API Not Calling Issue

## What Was Fixed

### Issue
The API was not being called because the code was looking for `currentUser.email` but the auth schema uses `currentUser.username`.

### Solution
Updated the code to use `currentUser.username` or fallback to `currentUser.idTokenClaims.preferred_username`.

## How to Debug

### Step 1: Check the Debug Panel
After restarting the dev server, you should see a purple debug panel in the bottom-right corner showing:
- ✓/✗ Authenticated status
- ✓/✗ Has Token
- Username
- Name
- Preferred Username
- User ID
- Full user object (expandable)

### Step 2: Check Console Logs
Open Chrome DevTools Console and look for:
```
=== VISITS API DEBUG ===
Current User: {...}
Current User Username: your.email@example.com
✓ Fetching visits for: your.email@example.com
API Response: [...]
✓ API visits received: X visits
✓ Transformed visits: [...]
======================
```

### Step 3: Verify the Fix
1. **Restart dev server** (important!):
   ```bash
   npm run dev
   ```

2. **Login with your email**

3. **Navigate to visits page**

4. **Check the debug panel** - it should show your username

5. **Check console** - it should show "Fetching visits for: [your-email]"

## Expected Behavior

### If Working Correctly:
- Debug panel shows: ✓ Authenticated: Yes
- Debug panel shows: Username: your.email@example.com
- Console shows: "✓ Fetching visits for: your.email@example.com"
- Console shows: "✓ API visits received: X visits"
- Page shows: "✓ Showing X visit(s) from API" (green text)

### If Still Not Working:
1. **Check if user is authenticated**:
   - Debug panel should show "✓ Authenticated: Yes"
   - If not, login might have failed

2. **Check if username exists**:
   - Debug panel should show your email in "Username" field
   - If not, check the "Full User Object" section

3. **Check console for errors**:
   - Look for red error messages
   - Check Network tab for failed requests

4. **Check API response**:
   - Open Network tab in DevTools
   - Look for POST to `/visits/get`
   - Check if it returns 200 OK
   - Check response data

## Common Issues

### Issue: "No user email/username found"
**Solution**: User might not be properly authenticated. Check:
- Is VITE_SKIP_AUTH=true in .env?
- Did you login successfully?
- Check debug panel for user info

### Issue: API returns empty array
**Solution**: 
- Check if your email has visits in the database
- Try with the test email: "evan.blankenship@helloporter.com"

### Issue: 401 Unauthorized
**Solution**:
- Token might be expired
- Refresh the page to get new token
- Check if Bearer token is in request headers

### Issue: CORS error
**Solution**:
- API must allow requests from localhost:3000
- Contact backend team to add CORS headers

## Testing with Different Email

To test with a specific email, you can temporarily hardcode it:

```typescript
// In visits-dashboard.tsx, replace:
const userEmail = currentUser?.username || currentUser?.idTokenClaims?.preferred_username

// With:
const userEmail = "evan.blankenship@helloporter.com" // Test email
```

## Remove Debug Component

After fixing the issue, remove the debug component:

1. Delete the import:
```typescript
import { DebugAuthInfo } from './debug-auth-info'
```

2. Remove the component:
```typescript
<DebugAuthInfo />
```

3. Optionally delete the file:
```
src/models/visits/components/visits/debug-auth-info.tsx
```
