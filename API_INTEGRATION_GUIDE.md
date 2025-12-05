# Visits API Integration Guide

## What Was Implemented

### 1. API Configuration
- **File**: `src/utils/axios-config.ts`
- Axios instance with Bearer token authentication
- Automatic token refresh from auth store
- Base URL: `https://0ku6tkr1e2.execute-api.us-east-2.amazonaws.com/prod`

### 2. API Service Layer
- **File**: `src/models/visits/services/visit-api.service.ts`
- `getVisits(username)` - Fetch visits with Bearer token
- `updateLab(payload)` - Update lab procedures
- `updateGap(payload)` - Update gap procedures

### 3. React Hook
- **File**: `src/models/visits/hooks/useVisitsApi.ts`
- Manages loading and error states
- Exposes `getVisits`, `updateLab`, `updateGap` methods

### 4. Data Transformation
- **File**: `src/models/visits/utils/visit-mapper.ts`
- `transformApiVisitToVisit()` - Converts API response to Visit type
- Maps labs and gaps to procedures
- Formats time, address, and status

### 5. Dashboard Integration
- **File**: `src/models/visits/components/visits/visits-dashboard.tsx`
- Fetches visits on component mount
- Shows API data when available, falls back to mock data
- Displays loading and error states

### 6. Visit Details Integration
- **File**: `src/models/visits/views/visit-details-view.tsx`
- Updates labs and gaps via API when outcomes are set
- Handles completed and not-completed outcomes
- Maps UI reasons to API enum values

### 7. Environment Configuration
- **File**: `.env`
- Added `VITE_VISITS_API_URL` variable

## How to Test

### 1. Check Console Logs
Open Chrome DevTools Console and look for:
```
Fetching visits for: [email]
API visits received: [array]
Transformed visits: [array]
```

### 2. Check Network Tab
- Open Chrome DevTools > Network tab
- Look for POST request to `/visits/get`
- Check request headers for `Authorization: Bearer [token]`
- Check response data

### 3. Verify API Call
The API should be called when:
- User is logged in (`currentUser.email` exists)
- Dashboard component mounts
- User email: Check auth store for current user email

### 4. Check for Errors
Common issues:
- **No user email**: Check if `currentUser?.email` exists
- **401 Unauthorized**: Check if Bearer token is valid
- **CORS errors**: Check API CORS configuration
- **Network errors**: Check API URL and connectivity

## Debugging Steps

### Step 1: Verify User Email
```javascript
// In browser console
useAuthStore.getState().currentUser?.email
```

### Step 2: Check API URL
```javascript
// In browser console
import.meta.env.VITE_VISITS_API_URL
```

### Step 3: Test API Manually
```bash
# Using curl (replace with actual token)
curl -X POST https://0ku6tkr1e2.execute-api.us-east-2.amazonaws.com/prod/visits/get \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"username":"your.email@example.com"}'
```

### Step 4: Check Auth Headers
```javascript
// In browser console
await useAuthStore.getState().getAuthHeaders()
```

## API Endpoints

### GET Visits
- **Endpoint**: `POST /visits/get`
- **Payload**: `{ "username": "email@example.com" }`
- **Headers**: `Authorization: Bearer [token]`

### Update Lab
- **Endpoint**: `POST /labs`
- **Payload**:
```json
{
  "PSC_Account__c": "001O300000SDK4DIAX",
  "Id": "a0UO300000DVZq4MAH",
  "PSC_Outcome__c": "Completed" | "Not Completed",
  "PSC_Not_Completed_Reason": "Kit Left Behind" | "Incomplete Consent" | ...
}
```

### Update Gap
- **Endpoint**: `POST /gaps`
- **Payload**:
```json
{
  "Id": "a1rO300005ByO6kIAF",
  "PSC_Outcome__c": "Completed" | "Not Completed",
  "PSC_Not_Completed_Reason__c": "Kit Left Behind" | "Incomplete Consent" | ...
}
```

## Next Steps

1. **Restart Dev Server**: After adding `.env` variable
   ```bash
   npm run dev
   ```

2. **Clear Browser Cache**: To ensure new code is loaded

3. **Check Console**: Look for API call logs

4. **Verify Data**: Check if visits from API are displayed

## Troubleshooting

### Issue: API not being called
- Check if user is logged in
- Check console for errors
- Verify `currentUser?.email` exists

### Issue: Showing mock data instead of API data
- Check if API response is empty
- Check console logs for "API visits received"
- Verify data transformation is working

### Issue: 401 Unauthorized
- Check if Bearer token is valid
- Check token expiration
- Try refreshing the page to get new token

### Issue: CORS error
- API must allow requests from your domain
- Check API CORS configuration
- Verify preflight OPTIONS request succeeds
