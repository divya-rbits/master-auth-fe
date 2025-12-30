# Frontend Development Plan

## Overview
Build a simple, secure master password entry page that integrates with the authentication middleware backend. The frontend will handle user login, token storage, and session management.

---

## Phase 1: Project Setup

### Task 1.1: Choose Frontend Framework
- [x] **Decision**: Using React with Vite for modern, fast development
- [x] React provides component reusability and better state management
- [x] Vite offers fast HMR and optimized builds

**Completion Criteria**: Framework decision documented

---

### Task 1.2: Initialize Frontend Project
- [ ] Run `npm create vite@latest master-auth-fe -- --template react`
- [ ] Navigate into project directory
- [ ] Install dependencies with `npm install`
- [ ] Clean up boilerplate files (remove default App.css content, etc.)
- [ ] Create `.env.example` for configuration
- [ ] Set up basic folder structure:
  - `src/components/` - React components
  - `src/services/` - API and storage services
  - `src/hooks/` - Custom React hooks
  - `src/context/` - Context providers

**Completion Criteria**: Project structure created

---

### Task 1.3: Setup Development Environment
- [ ] Verify `npm run dev` starts Vite dev server
- [ ] Create basic "Hello World" component
- [ ] Test Hot Module Replacement (HMR)
- [ ] Configure port in `vite.config.js` if needed (default 5173)
- [ ] Verify dev server runs at http://localhost:5173

**Completion Criteria**: Development server running, page visible

---

### Task 1.4: Install HTTP Client Library
- [ ] Install axios: `npm install axios`
- [ ] Create `src/services/api.js` for API calls
- [ ] Set up axios instance with base URL configuration
- [ ] Configure interceptors for request/response handling

**Completion Criteria**: Ready to make HTTP requests

---

## Phase 2: Basic UI - Master Password Page

### Task 2.1: Create Login Component Structure
- [ ] Create `src/components/Login.jsx` component
- [ ] Build component with JSX structure:
  - Logo/Title section
  - Password input field
  - Submit button
  - Error message container (conditional rendering)
  - Loading indicator (conditional rendering)
- [ ] Use React state for input value, loading, and error states
- [ ] Set up form with onSubmit handler

**Completion Criteria**: Login component structure complete and visible

---

### Task 2.2: Style the Login Component
- [ ] Create `src/components/Login.module.css` or use CSS-in-JS
- [ ] Style centered login card/container
- [ ] Style password input field:
  - Large, easy to read
  - Show/hide password toggle (optional)
  - Focus state styling
- [ ] Style submit button:
  - Clear call-to-action
  - Hover effects
  - Disabled state styling
- [ ] Add responsive design (mobile-friendly)
- [ ] Choose color scheme (professional, secure-looking)

**Completion Criteria**: Professional-looking login component

---

### Task 2.3: Add Loading & Error States
- [ ] Create `src/components/LoadingSpinner.jsx` component
- [ ] Create `src/components/ErrorMessage.jsx` component
- [ ] Add success message component (optional)
- [ ] Style different message types (error, success, info)
- [ ] Use conditional rendering based on state
- [ ] Test state transitions (loading, error, success)

**Completion Criteria**: All UI states visible and styled

---

### Task 2.4: Implement Show/Hide Password Toggle
- [ ] Add eye icon button next to password field
- [ ] Create state for password visibility (useState)
- [ ] Implement click handler to toggle visibility state
- [ ] Conditionally set input type based on state (password/text)
- [ ] Change icon between eye and eye-slash based on state
- [ ] Style toggle button

**Completion Criteria**: Users can reveal/hide password

---

## Phase 3: Frontend Logic - Authentication

### Task 3.1: Create Configuration File
- [ ] Create `src/config/constants.js` file
- [ ] Use environment variables from `.env` file
- [ ] Define middleware API URL using `import.meta.env.VITE_API_URL`
- [ ] Define application ID using `import.meta.env.VITE_APP_ID`
- [ ] Define token storage key name
- [ ] Define token expiration key name
- [ ] Example:
  ```javascript
  export const config = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    APP_ID: import.meta.env.VITE_APP_ID || 'transcript-detective',
    TOKEN_KEY: 'auth_token',
    EXPIRY_KEY: 'token_expires_at'
  };
  ```

**Completion Criteria**: Configuration centralized and accessible

---

### Task 3.2: Create API Service
- [ ] Create `src/services/api.js` file
- [ ] Set up axios instance with baseURL from config
- [ ] Implement `login(password)` function:
  - POST request to `/api/auth/login`
  - Send password and application_id
  - Return response data
- [ ] Implement `validateToken(token)` function:
  - POST request to `/api/auth/validate`
  - Send token and application_id
  - Return validation result
- [ ] Implement `logout(token)` function (optional):
  - POST request to `/api/auth/logout`
  - Send token in Authorization header
- [ ] Add error handling with try-catch blocks
- [ ] Export all functions for use in components/hooks

**Completion Criteria**: API service can communicate with backend

---

### Task 3.3: Create Storage Service
- [ ] Create `src/services/storage.js` file
- [ ] Implement `saveToken(token, expiresIn)`:
  - Save token to localStorage
  - Calculate and save expiration timestamp
- [ ] Implement `getToken()`:
  - Retrieve token from localStorage
  - Return token or null
- [ ] Implement `getTokenExpiry()`:
  - Retrieve expiration timestamp
  - Return timestamp or null
- [ ] Implement `clearToken()`:
  - Remove token from localStorage
  - Remove expiration from localStorage
- [ ] Export all functions

**Completion Criteria**: Token storage/retrieval working

---

### Task 3.4: Implement Login Form Handler
- [ ] In Login component, create handleSubmit function
- [ ] Prevent default form submission with `e.preventDefault()`
- [ ] Get password value from state
- [ ] Validate password is not empty
- [ ] Set loading state to true
- [ ] Disable submit button during request (using loading state)
- [ ] Call API service to login with async/await
- [ ] Handle success response
- [ ] Handle error response with try-catch
- [ ] Set loading state to false when done

**Completion Criteria**: Form submission calls backend API

---

### Task 3.5: Handle Login Success
- [ ] Receive token from API response
- [ ] Extract token and expires_in from response
- [ ] Call storage service to save token
- [ ] Show success message (optional)
- [ ] Use React Router's navigate to redirect to protected route
- [ ] Clear password input field (reset state)
- [ ] Log success to console (for debugging)

**Completion Criteria**: Successful login saves token and redirects

---

### Task 3.6: Handle Login Failure
- [ ] Catch API error response in try-catch block
- [ ] Extract error message from response
- [ ] Set error state to display error message
- [ ] Map error codes to user-friendly messages:
  - AUTH001 → "Invalid password"
  - AUTH006 → "Too many attempts, please try again later"
  - Network error → "Connection failed, please try again"
- [ ] Keep password field enabled for retry
- [ ] Optionally add CSS animation for error message

**Completion Criteria**: Login errors displayed clearly to user

---

## Phase 4: Session Management

### Task 4.1: Implement Token Check on Page Load
- [ ] Create `src/context/AuthContext.jsx` for auth state management
- [ ] Add useEffect in AuthContext to run on mount
- [ ] Call storage service to get token
- [ ] If no token exists:
  - Set authenticated state to false
- [ ] If token exists:
  - Proceed to validate token (Task 4.2)
- [ ] Provide auth state and functions via Context

**Completion Criteria**: App checks for existing token on startup

---

### Task 4.2: Implement Token Validation
- [ ] In AuthContext, get token from storage
- [ ] Call API service to validate token
- [ ] If token valid:
  - Set authenticated state to true
  - Update user context/state
- [ ] If token invalid/expired:
  - Clear token from storage
  - Set authenticated state to false
  - Set error message "Session expired"
- [ ] Use loading state during validation

**Completion Criteria**: Existing tokens validated with backend

---

### Task 4.3: Create Token Expiry Checker
- [ ] Create custom hook `src/hooks/useTokenExpiry.js`
- [ ] Use useEffect with setInterval to check expiration
- [ ] Calculate time remaining until expiration
- [ ] If less than 5 minutes remaining:
  - Show warning message (optional)
  - Or automatically trigger refresh (optional)
- [ ] If expired:
  - Call logout function from AuthContext
- [ ] Clean up interval on unmount

**Completion Criteria**: App detects expiring/expired tokens

---

### Task 4.4: Implement Auto Token Refresh (Optional)
- [ ] Add refresh logic to useTokenExpiry hook
- [ ] Use setTimeout to refresh token 5 minutes before expiry
- [ ] Call backend refresh endpoint via API service
- [ ] Update stored token with new token
- [ ] Update AuthContext state with new token
- [ ] Reschedule next refresh
- [ ] Handle refresh failures (call logout)

**Completion Criteria**: Tokens auto-refresh before expiration

---

### Task 4.5: Implement Logout Functionality
- [ ] Add logout function to AuthContext
- [ ] Create logout button component (optional)
- [ ] In logout function:
  - Call API service to logout (revoke token)
  - Clear token from storage
  - Set authenticated state to false
  - Navigate to login page using React Router
- [ ] Show "Logged out successfully" message
- [ ] Provide logout via context to all components

**Completion Criteria**: Users can manually logout

---

## Phase 5: Integration & Routing

### Task 5.1: Create Success Page for Cross-Subdomain Redirect

**NOTE**: For cross-subdomain architecture, we need a success page instead of a traditional dashboard.

- [x] ✅ Create `src/pages/AuthSuccess.jsx` component
- [x] ✅ Show "Authentication successful, redirecting..." message
- [x] ✅ Display 2-second countdown timer with animation
- [x] ✅ Extract `returnUrl` from query parameters
- [x] ✅ Show destination hostname for transparency
- [x] ✅ Auto-redirect to returnUrl after countdown
- [x] ✅ Style to match terminal theme
- [ ] Keep `src/components/Dashboard.jsx` for testing only (optional)

**Completion Criteria**: Success page exists and redirects users back to their app ✅

---

### Task 5.2: Implement Client-Side Routing

**NOTE**: Routes updated for cross-subdomain authentication flow.

- [x] ✅ Install react-router-dom: `npm install react-router-dom`
- [x] ✅ Set up BrowserRouter in `src/App.jsx`
- [x] ✅ Create routes for:
  - `/` → Login component (or redirect to dashboard if authenticated)
  - `/success` → AuthSuccess component (protected, shows countdown and redirects)
  - `/dashboard` → Dashboard component (protected, for testing only)
- [x] ✅ Wrap app with AuthProvider (AuthContext)
- [x] ✅ Ensure routes have access to auth context
- [x] ✅ Extract and forward `returnUrl` query parameter through the flow

**Completion Criteria**: App can navigate between login, success page, and dashboard ✅

---

### Task 5.3: Create Authentication Guard

**NOTE**: For the cross-subdomain architecture, authentication guards work differently:

**For Master Password App (`masterpass.reversebits.com`):**
- [x] ✅ Authentication guard is handled by route-level checks in App.jsx
- [x] ✅ `/success` route requires authentication (already protected)
- [x] ✅ `/dashboard` route requires authentication (for testing only)
- [x] ✅ Unauthenticated users see login page at `/`
- [x] ✅ No need for PrivateRoute component in master password app

**For Other Apps (`td.reversebits.com`, etc.):**
- [ ] Create AuthContext that redirects to master password page if no token
- [ ] Validate token with backend API on app load
- [ ] If invalid/expired, redirect to `masterpass.reversebits.com?returnUrl=...`
- [ ] See "Integration with Other Apps" section below for full implementation

**Completion Criteria**:
- Master password app: Routes properly protected with inline checks ✅ **COMPLETED**
- Other apps: Use redirect-based authentication flow (see Integration Guide)

---

## Phase 6: Error Handling & Edge Cases

### Task 6.1: Handle Network Errors
- [ ] Wrap API calls in try-catch
- [ ] Detect network failures (no connection)
- [ ] Show user-friendly error message
- [ ] Provide retry button
- [ ] Log errors to console

**Completion Criteria**: Network failures handled gracefully

---

### Task 6.2: Handle API Timeout
- [ ] Configure axios timeout in axios instance (e.g., 10 seconds)
- [ ] If timeout exceeded:
  - Catch timeout error
  - Show "Request timed out" message
  - Allow retry
- [ ] Optionally implement AbortController for manual cancellation

**Completion Criteria**: Long-running requests time out appropriately

---

### Task 6.3: Handle Browser Storage Errors
- [ ] Wrap localStorage access in try-catch
- [ ] Handle cases where localStorage is disabled
- [ ] Handle cases where storage quota exceeded
- [ ] Fall back to sessionStorage if needed
- [ ] Show error if storage unavailable

**Completion Criteria**: Storage failures don't crash the app

---

### Task 6.4: Handle Tab/Window Close
- [ ] Decide on token persistence strategy:
  - localStorage (persists after browser close)
  - sessionStorage (clears on tab close)
- [ ] If using sessionStorage, warn user about session loss
- [ ] Optionally add "Remember me" checkbox

**Completion Criteria**: Token persistence behavior defined and working

---

### Task 6.5: Implement Rate Limiting Handling
- [ ] Detect 429 Too Many Requests response from API
- [ ] Parse error response to identify rate limiting
- [ ] Show user-friendly "Too many attempts, please try again later" message
- [ ] Parse retry-after header from response (if backend provides it)
- [ ] Display countdown timer until retry is allowed
- [ ] Disable submit button during rate limit period
- [ ] Store rate limit expiry timestamp in localStorage
- [ ] Implement separate rate limit state for login endpoint vs validate endpoint
- [ ] Add visual indicator (progress bar or countdown timer in UI)
- [ ] Clear rate limit state after successful request
- [ ] Add CSS styling for rate limit message (warning/error style)

**API Context**:
- Login endpoint: 5 requests/minute per IP (returns 429)
- Validate endpoint: 100 requests/minute per IP (returns 429)

**Completion Criteria**: Users see countdown timer and cannot spam requests during rate limit

---

### Task 6.6: Add Session ID Storage and Tracking
- [x] Update `src/services/storage.js` to handle sessionId
- [x] Modify `saveToken(token, sessionId, expiresIn)` signature:
  - Add sessionId parameter
  - Save sessionId to localStorage with key `SESSION_ID_KEY`
- [x] Add `getSessionId()` function:
  - Retrieve sessionId from localStorage
  - Return sessionId or null
- [x] Update `clearToken()` function:
  - Remove sessionId from localStorage
  - Clear both token and sessionId together
- [x] Add `SESSION_ID_KEY` constant to `src/config/constants.js`
- [x] Update `src/context/AuthContext.jsx`:
  - Store sessionId in state
  - Extract sessionId from login response
  - Pass sessionId to saveToken()
  - Provide sessionId via context
- [x] Update API service to extract sessionId from responses:
  - Login response includes `sessionId` (UUID)
  - Validate response includes `sessionId`

**API Context**:
- Login response: `{ success: true, token: "...", sessionId: "uuid", expiresIn: 3600, expiresAt: "ISO timestamp" }`
- Validate response: `{ valid: true, sessionId: "uuid", applicationId: "...", permissions: [...] }`

**Completion Criteria**: Session ID stored alongside token and retrievable from storage

---

### Task 6.7: Fix Logout Request Format ✅
- [x] Open `src/services/api.js` file
- [x] Locate the `logout(token)` function
- [x] Update logout request to send token in request body instead of Authorization header:
  - **Current**: `headers: { Authorization: Bearer ${token} }`
  - **Required**: `body: { token: string }`
- [x] Change axios call from:
  ```javascript
  axios.post('/api/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } })
  ```
  To:
  ```javascript
  axios.post('/api/auth/logout', { token })
  ```
- [x] Remove Authorization header from logout request
- [x] Test logout functionality with corrected format
- [x] Verify backend accepts token in body and revokes it successfully

**API Context**:
- Logout endpoint expects: `POST /api/auth/logout` with body `{ token: string }`
- Response: `{ success: true, message: "Token revoked successfully" }`

**Completion Criteria**: Logout sends token in request body and successfully revokes token ✅

---

### Task 6.8: Verify and Fix API Response Field Naming ✅
- [x] Check with backend team: Does API use camelCase (expiresIn) or snake_case (expires_in)?
- [x] Review integration doc examples vs actual backend responses
- [x] Open `src/context/AuthContext.jsx` around line 76
- [x] Identify field name used for token expiration:
  - Integration doc shows: `expiresIn` (camelCase)
  - Current code may use: `expires_in` (snake_case)
- [x] Standardize all API response field parsing to match backend
- [x] Update field references in:
  - AuthContext.jsx (login success handler)
  - API service response parsing
  - Storage service (if applicable)
- [x] Add JSDoc comments or TypeScript types documenting exact API response format
- [x] Test with actual backend to confirm field names
- [x] Document actual response format in code comments

**Fields to verify**:
- `expiresIn` vs `expires_in` (token expiration duration in seconds) ✅ Confirmed: camelCase
- `expiresAt` vs `expires_at` (ISO timestamp of expiration) ✅ Confirmed: camelCase
- `applicationId` vs `application_id` (app identifier) ✅ Confirmed: camelCase

**Verification Result**: Backend returns camelCase field names. Frontend code already uses correct field names. Added comprehensive JSDoc documentation to API service.

**Completion Criteria**: All API response fields correctly parsed with consistent naming convention ✅

---

### Task 6.9: Implement Automatic Token Refresh (if backend supports /api/auth/refresh) ✅
- [x] **Verify with backend team**: Is `/api/auth/refresh` endpoint available?
- [x] If available, add `refreshToken(token)` function to `src/services/api.js`:
  - POST request to `/api/auth/refresh`
  - Send current token in request body: `{ token }`
  - Handle 401 errors (refresh failed, token revoked)
  - Return new token response with same sessionId
- [x] Update `src/hooks/useTokenExpiry.js`:
  - Calculate time to refresh (5 minutes before expiry)
  - Use setTimeout to trigger refresh at exact time
  - Call refreshToken() function
  - On success: update stored token and expiry
  - On failure: call logout function
- [x] Prevent multiple simultaneous refresh requests:
  - Use useRef to track "refresh in progress" flag
  - Skip refresh if already in progress
  - Queue additional refresh requests if needed
- [x] Update `src/context/AuthContext.jsx`:
  - Add `isRefreshing` state (optional)
  - Provide refresh function via context
  - Show subtle indicator during refresh (optional)
- [x] Test edge cases:
  - Network error during refresh
  - Token revoked (401 response)
  - Multiple tabs attempting refresh simultaneously
- [x] Clear old timeout when component unmounts

**API Context**:
- Refresh endpoint: `POST /api/auth/refresh` with body `{ token: string }`
- Response: `{ success: true, token: "new_token", sessionId: "same_uuid", expiresIn: 3600, expiresAt: "ISO timestamp" }`

**Completion Criteria**: Tokens automatically refresh 5 minutes before expiry without user intervention ✅

---

### Task 6.10: Add Permissions Storage and Handling ✅
- [x] Update `src/context/AuthContext.jsx` to store permissions in state:
  - Add `permissions` state variable (array of strings)
  - Extract permissions from login response
  - Extract permissions from validate response
  - Provide permissions via context
- [x] Create custom hook `src/hooks/usePermissions.js`:
  - Return permissions array from AuthContext
  - Provide helper function `hasPermission(permission)` to check specific permission
  - Return loading state while permissions are being fetched
- [x] Update login success handler in AuthContext:
  - Parse `permissions` field from response
  - Store in state: `setPermissions(response.permissions || [])`
- [x] Update token validation handler:
  - Parse `permissions` field from validate response
  - Update permissions state
- [x] Add permissions to storage service (optional):
  - Store permissions in localStorage alongside token
  - Restore on page load
- [x] Document how other apps should access and use permissions:
  - Add example in integration guide
  - Show permission-based route guarding
  - Show conditional UI rendering based on permissions

**API Context**:
- Login response: `{ ..., permissions: ["read", "write", "admin"] }`
- Validate response: `{ valid: true, ..., permissions: ["read", "write"] }`

**Completion Criteria**: Permissions stored in context and accessible via usePermissions hook ✅

---

### Task 6.11: Add ApplicationId Validation ✅
- [x] Update token validation in `src/context/AuthContext.jsx`
- [x] After receiving validate response from API:
  - Extract `applicationId` from response
  - Compare with `config.APP_ID` from constants
- [x] If applicationId doesn't match:
  - Log warning to console: `Token applicationId mismatch: expected ${config.APP_ID}, got ${applicationId}`
  - Decide behavior (choose one):
    - **Option A (Strict)**: Reject token and force logout ✅ Implemented
    - **Option B (Permissive)**: Log warning but allow access ✅ Implemented
- [x] Add configuration flag for strict mode (optional):
  - `VITE_STRICT_APP_ID_CHECK=true/false` ✅ Added
  - Use in development: false (permissive) ✅ Default
  - Use in production: true (strict) ✅ Configurable
- [x] Test with mismatched applicationId
- [x] Document security implications in code comments

**API Context**:
- Validate response: `{ valid: true, applicationId: "transcript-detective", ... }`
- Should match `config.APP_ID` defined in constants

**Completion Criteria**: ApplicationId from response validated against expected app ID with appropriate handling ✅

---

### Task 6.12: Standardize Environment Variable Names ✅
- [x] Document environment variable naming differences:
  - **Frontend Plan uses**: `VITE_API_URL`, `VITE_APP_ID`
  - **Integration Doc uses**: `VITE_API_BASE_URL`, `VITE_APPLICATION_ID`
- [x] Decide on standard naming convention (consult backend team):
  - Choose consistent names across all apps
  - Document decision in this task
- [x] Update `src/config/constants.js` if needed:
  - Use chosen environment variable names
  - Add fallback for both naming conventions during migration
- [x] Update `.env.example` file:
  - List all required environment variables with clear comments
  - Mark which are required vs optional
  - Add example values
- [x] Add `VITE_FRONTEND_URL` if needed for 3rd party redirects:
  - Used by other apps to construct returnUrl
  - Example: `VITE_FRONTEND_URL=https://masterpass.reversebits.com`
- [x] Update documentation to reflect finalized variable names

**Decision**: Standardized on integration documentation naming convention:
- `VITE_API_BASE_URL` (instead of `VITE_API_URL`)
- `VITE_APPLICATION_ID` (instead of `VITE_APP_ID`)
- `VITE_FRONTEND_URL` (added for cross-subdomain redirects)

**Updated .env.example**:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_APPLICATION_ID=master-password-auth
VITE_FRONTEND_URL=https://masterfrontend.reversebits.tech

# Security Configuration
VITE_STRICT_APP_ID_CHECK=false
```

**Completion Criteria**: Environment variables standardized and documented with clear naming convention ✅

---

### Task 6.13: Align with Integration Documentation ✅
- [x] Created `tasks/todo_align_integration_docs.md` to track alignment tasks
- [x] Identified discrepancies between code and integration documentation
- [x] Standardized environment variable names (Task 1)
  - Changed `VITE_API_URL` → `VITE_API_BASE_URL`
  - Changed `VITE_APP_ID` → `VITE_APPLICATION_ID`
  - Added `VITE_FRONTEND_URL`
- [x] Fixed API base URL default value (Task 2)
  - Changed default port from 3001 → 3000
- [x] Verified API response field naming (Task 3)
  - Confirmed backend returns camelCase fields
  - Added comprehensive JSDoc documentation
- [x] Added VITE_FRONTEND_URL to configuration (Task 4)
  - Added to constants.js with window.location.origin fallback

**Alignment Result**: Frontend fully aligned with integration documentation standards.

**Completion Criteria**: All integration documentation discrepancies resolved ✅

---

## Phase 7: Security & Best Practices

### Task 7.1: Implement HTTPS Enforcement (Production)
- [x] Ensure API calls use HTTPS in production
- [x] Add check to warn if running on HTTP (except localhost)
- [x] Update config to use environment-based URLs

**Completion Criteria**: Production uses HTTPS for API calls ✅

---

### Task 7.2: Implement XSS Protection
- [x] Never use `dangerouslySetInnerHTML` with user input
- [x] React escapes content by default - leverage this
- [x] Sanitize any dynamic content if necessary
- [x] Set Content-Security-Policy headers (if possible)

**Completion Criteria**: XSS vulnerabilities mitigated ✅

**Implementation Details**:
- Fixed open redirect vulnerability in AuthSuccess.jsx
- Fixed unvalidated query parameter in Login.jsx
- Created URL validation utility with domain whitelist
- Installed DOMPurify for future sanitization needs
- Created CSP configuration guide
- See [tasks/todo_xss_protection.md](tasks/todo_xss_protection.md) for full details

---

### Task 7.3: Add Rate Limiting Feedback
- [x] Detect 429 (Too Many Requests) response
- [x] Show appropriate message: "Too many attempts"
- [x] Display countdown timer (if backend provides retry-after)
- [x] Disable login button until rate limit resets

**Completion Criteria**: Rate limit responses handled gracefully ✅

**Implementation Details**:
- Detects 429 status code and AUTH006 error code ([api.js:109](src/services/api.js#L109))
- Displays "Too many attempts. Try again in Xs" message ([Login.jsx:202](src/components/Login.jsx#L202))
- Real-time countdown timer updates every second ([Login.jsx:65-81](src/components/Login.jsx#L65-L81))
- Login button disabled while rate limited ([Login.jsx:261](src/components/Login.jsx#L261))
- Rate limit state persists across page refreshes (storage.js)
- Automatically clears when countdown reaches zero

---

### Task 7.4: Implement Password Field Security
- [x] Use `autocomplete="current-password"` on input
- [x] Prevent password managers from interfering (if needed)
- [x] Clear password field after submission
- [x] Don't store password in variables longer than necessary

**Completion Criteria**: Password input follows security best practices ✅

**Implementation Details**:
- Changed `autoComplete="off"` to `autoComplete="current-password"` ([Login.jsx:218](src/components/Login.jsx#L218))
- Password field cleared immediately after successful login ([Login.jsx:106](src/components/Login.jsx#L106))
- Password passed directly to API, not stored in intermediate variables
- Password managers now allowed to save/autofill (better UX for master password)
- Type="password" for visual security

---

## Phase 8: User Experience Enhancements

### Task 8.1: Add Keyboard Shortcuts
- [x] Allow Enter key to submit login form
- [ ] Allow Escape key to clear error messages
- [x] Ensure focus management is keyboard-friendly
- [x] Test all interactions with keyboard only

**Completion Criteria**: Keyboard navigation fully functional ⚠️ (Mostly complete, Escape key optional)

**Implementation Details**:
- Enter key submits form via form onSubmit ([Login.jsx:208](src/components/Login.jsx#L208))
- Auto-focus on password input on mount ([Login.jsx:29-30](src/components/Login.jsx#L29-L30))
- Focus states tracked for visual feedback ([Login.jsx:214-215](src/components/Login.jsx#L214-L215))
- Errors auto-clear after 3 seconds (no need for Escape key)
- Note: Escape key to clear errors not implemented (errors auto-clear, so not critical)

---

### Task 8.2: Add Loading States
- [x] Show spinner during login
- [x] Show spinner during token validation
- [x] Disable inputs during loading
- [x] Add subtle animations for better UX

**Completion Criteria**: Loading states provide feedback ✅

**Implementation Details**:
- Loading dots animation during login ([Login.jsx:258-262](src/components/Login.jsx#L258-L262))
- Loading state in AuthContext for token validation ([AuthContext.jsx:11](src/context/AuthContext.jsx#L11))
- Login button disabled during loading ([Login.jsx:266](src/components/Login.jsx#L266))
- Form submission blocked while loading ([Login.jsx:89](src/components/Login.jsx#L89))
- CSS animations for loading dots (styles.loadingDots)

---

### Task 8.3: Add Accessibility Features
- [x] Add ARIA labels to form elements
- [ ] Add screen reader announcements for errors
- [x] Ensure proper focus management
- [x] Test with keyboard navigation
- [ ] Test with screen reader (basic)
- [ ] Add proper heading hierarchy

**Completion Criteria**: Basic accessibility standards met ⚠️ (Mostly complete)

**Implementation Details**:
- Password toggle has aria-label ([Login.jsx:227](src/components/Login.jsx#L227))
- Auto-focus on mount for keyboard users ([Login.jsx:29-30](src/components/Login.jsx#L29-L30))
- Form is keyboard navigable (Enter to submit, Tab to navigate)
- Input has proper type="password" and autoComplete attributes
- Visual focus indicators via CSS
- Note: Screen reader announcements and heading hierarchy not implemented (nice-to-have)

---

### Task 8.4: Add Responsive Design
- [ ] Test on mobile devices (or browser dev tools)
- [ ] Ensure login form is usable on small screens
- [ ] Adjust font sizes for readability
- [ ] Test landscape and portrait orientations
- [ ] Ensure touch targets are large enough

**Completion Criteria**: Works well on mobile and desktop

---

## Phase 9: Testing

### Task 9.1: Manual Testing Checklist

**Updated for cross-subdomain architecture:**

- [ ] Test successful login with correct password
- [ ] Test failed login with wrong password
- [ ] Test success page appears with countdown after login
- [ ] Test returnUrl extraction from query parameters
- [ ] Test redirect to returnUrl after countdown
- [ ] Test redirect with no returnUrl (uses default)
- [ ] Test token validation on page reload
- [ ] Test logout functionality
- [ ] Test with no network connection
- [ ] Test with expired token
- [ ] Test rate limiting (5+ failed attempts)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test full cross-subdomain flow:
  - Visit `masterpass.reversebits.com?returnUrl=https://td.reversebits.com`
  - Login successfully
  - Verify redirect back to td.reversebits.com

**Completion Criteria**: All manual tests pass including cross-subdomain flow

---

### Task 9.2: Test Edge Cases
- [ ] Test with empty password field
- [ ] Test with very long password (1000+ characters)
- [ ] Test with special characters in password
- [ ] Test with localStorage disabled
- [ ] Test with JavaScript disabled (show fallback message)
- [ ] Test rapid clicking of submit button

**Completion Criteria**: Edge cases handled properly

---

### Task 9.3: Security Testing
- [ ] Verify token is not visible in URL
- [ ] Verify password is not logged to console
- [ ] Verify token storage is secure (not in cookies without HttpOnly)
- [ ] Test that expired tokens are rejected
- [ ] Test that tampered tokens are rejected

**Completion Criteria**: No obvious security vulnerabilities

---

## Phase 10: Documentation & Deployment

### Task 10.1: Create User Documentation
- [ ] Write simple user guide
- [ ] Explain how to use the login page
- [ ] Explain what to do if password is forgotten
- [ ] Document supported browsers

**Completion Criteria**: Basic user documentation exists

---

### Task 10.2: Create Developer Documentation
- [ ] Document folder structure
- [ ] Document how to configure API URL
- [ ] Document how to integrate with other apps
- [ ] Provide code examples for common tasks
- [ ] Document token storage strategy

**Completion Criteria**: Developers can understand and modify the code

---

### Task 10.3: Prepare for Deployment
- [ ] Create production build with `npm run build`
- [ ] Vite automatically minifies JavaScript and CSS
- [ ] Optimize images in public folder
- [ ] Update .env.production with production API URL
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all assets load correctly

**Completion Criteria**: Production-ready build created

---

### Task 10.4: Deploy Frontend
- [ ] Choose hosting platform:
  - Netlify (recommended for static sites)
  - Vercel
  - GitHub Pages
  - Or serve from backend server
- [ ] Deploy files to hosting platform
- [ ] Configure custom domain (if applicable)
- [ ] Enable HTTPS
- [ ] Test deployed site

**Completion Criteria**: Frontend live and accessible

---

### Task 10.5: Test End-to-End Integration

**Updated for cross-subdomain architecture:**

- [ ] Test complete flow: login → success page → redirect to other app
- [ ] Test integration with actual app (e.g., Transcript Detective):
  - App detects no token → redirects to masterpass.reversebits.com
  - User logs in → sees success page
  - Auto-redirect back to app → app validates token
  - App grants access
- [ ] Test from different devices
- [ ] Test with production backend
- [ ] Verify all features working across subdomains
- [ ] Test token sharing via localStorage (same domain)
- [ ] Fix any issues found

**Completion Criteria**: Complete cross-subdomain authentication working end-to-end

---

## Phase 11: Advanced Features (Optional)

### Task 11.1: Add "Remember Me" Functionality
- [ ] Add checkbox to login form
- [ ] If checked: use localStorage (persistent)
- [ ] If unchecked: use sessionStorage (temporary)
- [ ] Save user preference

**Completion Criteria**: Users can choose token persistence

---

### Task 11.2: Add Session Timeout Warning
- [ ] Show modal/notification 5 minutes before expiration
- [ ] Offer to extend session (refresh token)
- [ ] Countdown timer in notification
- [ ] Auto-logout if no action taken

**Completion Criteria**: Users warned before session expires

---

### Task 11.3: Add Multi-Tab Synchronization

**NOTE**: For cross-subdomain architecture, multi-tab sync is less critical since users typically redirect away from master password app after authentication.

- [ ] Use localStorage events to sync across tabs (optional)
- [ ] If user logs out in one tab, logout all tabs
- [ ] For other apps: each app independently validates token on load
- [ ] Cross-subdomain sync happens naturally via backend token validation

**Completion Criteria**: Authentication state synced within master password app tabs (optional feature)

---

### Task 11.4: Add Theme Switcher (Dark/Light Mode)
- [ ] Create CSS for dark theme
- [ ] Add theme toggle button
- [ ] Save theme preference to localStorage
- [ ] Apply theme on page load
- [ ] Respect system theme preference

**Completion Criteria**: Users can switch between themes

---

## Success Metrics

The frontend will be considered complete when:
- ✅ Master password page is functional and styled
- ✅ Users can login with correct password
- ✅ Invalid passwords show error messages
- ✅ Tokens are stored and validated on page load
- ✅ Success page shows countdown and redirects to returnUrl
- ✅ returnUrl parameter is properly extracted and forwarded
- ✅ Cross-subdomain redirect flow works correctly
- ✅ Users can logout (if feature exists)
- ✅ Works on desktop and mobile browsers
- ✅ All manual tests pass
- ✅ Deployed and accessible via HTTPS
- ✅ Ready for integration with actual applications
- ✅ Documentation complete with cross-subdomain integration guide

---

## Integration with Other Apps

### Cross-Subdomain Authentication Architecture

This master password application is designed to work as a **centralized authentication service** across multiple subdomains on the same server.

#### Architecture Overview:
- **Master Password Auth**: Hosted at `masterpass.reversebits.com`
- **Other Apps**: Hosted at subdomains like `td.reversebits.com` (Transcript Detective)
- **Backend Server**: Single server running 24/7 serving all apps

#### Authentication Flow:

```
1. User visits: td.reversebits.com
2. App checks for token in localStorage
3. If no token or invalid:
   → Redirect to masterpass.reversebits.com?returnUrl=https://td.reversebits.com
4. User authenticates at master password page
5. Success page shows "Authentication successful, redirecting..." (2 seconds)
6. Auto-redirect back to td.reversebits.com
7. App validates token via backend API
8. If valid → Grant access
```

#### Why This Approach?

**Cross-Subdomain Challenges:**
- localStorage is **not shared** between different subdomains (different origins)
- Each subdomain has isolated storage (td.reversebits.com ≠ masterpass.reversebits.com)
- Shared AuthContext only works within a single application, not across subdomains

**Benefits of Centralized Auth Service:**
1. **Clean Separation**: Master password is a dedicated authentication service
2. **Single Source of Truth**: Token validation happens via backend API
3. **Works Across Subdomains**: Each app redirects to central auth and gets redirected back
4. **Simpler to Maintain**: Each app is independent but uses same auth backend
5. **Better Security**: Centralized authentication with proper redirects
6. **Scalable**: Easy to add more apps using the same auth service

---

### Integration Guide for Other Apps

When integrating other apps (e.g., Transcript Detective) with this authentication system:

#### Step 1: Create Auth Check in Your App

```javascript
// In your app (e.g., td.reversebits.com)
// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, saveToken, clearToken } from '../services/storage'
import { validateToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()

      if (!token) {
        // No token, redirect to master password page
        const currentUrl = window.location.href
        window.location.href = `https://masterpass.reversebits.com?returnUrl=${encodeURIComponent(currentUrl)}`
        return
      }

      // Token exists, validate it with backend
      try {
        const response = await validateToken(token)

        if (response.valid) {
          setIsAuthenticated(true)
          setUser(response.user || null)
        } else {
          // Invalid token, redirect to master password
          clearToken()
          const currentUrl = window.location.href
          window.location.href = `https://masterpass.reversebits.com?returnUrl=${encodeURIComponent(currentUrl)}`
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        clearToken()
        // Redirect to master password on error
        window.location.href = 'https://masterpass.reversebits.com'
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    clearToken()
    setIsAuthenticated(false)
    setUser(null)
    // Redirect to master password page
    window.location.href = 'https://masterpass.reversebits.com'
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

#### Step 2: Handle Return from Master Password

```javascript
// In your app's main component or a dedicated callback handler
// This runs when user returns from masterpass.reversebits.com

useEffect(() => {
  // Check if we're returning from master password auth
  const params = new URLSearchParams(window.location.search)
  const fromAuth = params.get('fromAuth')

  if (fromAuth) {
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname)

    // Token should now be in localStorage (set by master password app)
    // AuthContext will validate it
  }
}, [])
```

#### Step 3: Create API Service with Token

```javascript
// src/services/api.js
import axios from 'axios'
import { getToken } from './storage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
})

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses (invalid/expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid, redirect to master password
      clearToken()
      window.location.href = 'https://masterpass.reversebits.com?returnUrl=' +
        encodeURIComponent(window.location.href)
    }
    return Promise.reject(error)
  }
)

export const validateToken = async (token) => {
  const response = await api.post('/api/auth/validate', {
    token,
    application_id: 'transcript-detective' // Your app ID
  })
  return response.data
}

export default api
```

#### Step 4: Storage Service (Same across all apps)

```javascript
// src/services/storage.js
export const TOKEN_KEY = 'auth_token'
export const EXPIRY_KEY = 'token_expires_at'

export function saveToken(token, expiresIn) {
  localStorage.setItem(TOKEN_KEY, token)
  const expirationTime = Date.now() + (expiresIn * 1000)
  localStorage.setItem(EXPIRY_KEY, expirationTime.toString())
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRY_KEY)
}
```

---

### Key Points:

1. **Each app is independent** - No shared AuthContext, each has its own
2. **Token validation via API** - Always validate with backend, never trust localStorage alone
3. **Redirect-based flow** - Apps redirect to master password, then back
4. **returnUrl parameter** - Critical for knowing where to redirect after auth
5. **Backend is single source of truth** - All apps validate against same backend API

### Testing Your Integration:

1. Visit your app: `http://td.reversebits.com`
2. App detects no token → Redirects to `http://masterpass.reversebits.com?returnUrl=http://td.reversebits.com`
3. Enter master password
4. See success page with countdown
5. Auto-redirect back to `http://td.reversebits.com`
6. App validates token and grants access

---

## Notes

- Keep the frontend simple and focused on authentication
- Prioritize security over fancy features
- Test thoroughly on multiple browsers and devices
- Document everything for future developers
- Make it easy to integrate with other applications
