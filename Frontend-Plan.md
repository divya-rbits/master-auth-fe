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

### Task 5.1: Create Main Application Placeholder
- [ ] Create `src/pages/Dashboard.jsx` component
- [ ] Add simple content: "You are authenticated!"
- [ ] Include logout button using AuthContext
- [ ] Display token expiration time (optional)
- [ ] This will be replaced with actual app later

**Completion Criteria**: Protected page exists for successful login

---

### Task 5.2: Implement Client-Side Routing
- [ ] Install react-router-dom: `npm install react-router-dom`
- [ ] Set up BrowserRouter in `src/main.jsx` or `src/App.jsx`
- [ ] Create routes for:
  - `/login` → Login component
  - `/dashboard` → Dashboard component (protected)
  - `/` → Redirect to dashboard or login based on auth
- [ ] Wrap app with AuthProvider (AuthContext)
- [ ] Ensure routes have access to auth context

**Completion Criteria**: App can navigate between login and protected pages

---

### Task 5.3: Create Authentication Guard
- [ ] Create `src/components/PrivateRoute.jsx` component
- [ ] Use AuthContext to check if user is authenticated
- [ ] If authenticated: render children/Outlet
- [ ] If not authenticated: Navigate to /login
- [ ] Show loading state while checking authentication
- [ ] Apply to all protected routes using Route wrapper

**Completion Criteria**: Unauthenticated users redirected to login

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

## Phase 7: Security & Best Practices

### Task 7.1: Implement HTTPS Enforcement (Production)
- [ ] Ensure API calls use HTTPS in production
- [ ] Add check to warn if running on HTTP (except localhost)
- [ ] Update config to use environment-based URLs

**Completion Criteria**: Production uses HTTPS for API calls

---

### Task 7.2: Implement XSS Protection
- [ ] Never use `dangerouslySetInnerHTML` with user input
- [ ] React escapes content by default - leverage this
- [ ] Sanitize any dynamic content if necessary
- [ ] Set Content-Security-Policy headers (if possible)

**Completion Criteria**: XSS vulnerabilities mitigated

---

### Task 7.3: Add Rate Limiting Feedback
- [ ] Detect 429 (Too Many Requests) response
- [ ] Show appropriate message: "Too many attempts"
- [ ] Display countdown timer (if backend provides retry-after)
- [ ] Disable login button until rate limit resets

**Completion Criteria**: Rate limit responses handled gracefully

---

### Task 7.4: Implement Password Field Security
- [ ] Use `autocomplete="current-password"` on input
- [ ] Prevent password managers from interfering (if needed)
- [ ] Clear password field after submission
- [ ] Don't store password in variables longer than necessary

**Completion Criteria**: Password input follows security best practices

---

## Phase 8: User Experience Enhancements

### Task 8.1: Add Keyboard Shortcuts
- [ ] Allow Enter key to submit login form
- [ ] Allow Escape key to clear error messages
- [ ] Ensure focus management is keyboard-friendly
- [ ] Test all interactions with keyboard only

**Completion Criteria**: Keyboard navigation fully functional

---

### Task 8.2: Add Loading States
- [ ] Show spinner during login
- [ ] Show spinner during token validation
- [ ] Disable inputs during loading
- [ ] Add subtle animations for better UX

**Completion Criteria**: Loading states provide feedback

---

### Task 8.3: Add Accessibility Features
- [ ] Add ARIA labels to form elements
- [ ] Add screen reader announcements for errors
- [ ] Ensure proper focus management
- [ ] Test with keyboard navigation
- [ ] Test with screen reader (basic)
- [ ] Add proper heading hierarchy

**Completion Criteria**: Basic accessibility standards met

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
- [ ] Test successful login with correct password
- [ ] Test failed login with wrong password
- [ ] Test token validation on page reload
- [ ] Test logout functionality
- [ ] Test with no network connection
- [ ] Test with expired token
- [ ] Test rate limiting (5+ failed attempts)
- [ ] Test on different browsers (Chrome, Firefox, Safari)

**Completion Criteria**: All manual tests pass

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
- [ ] Test complete flow: login → validate → protected page
- [ ] Test from different devices
- [ ] Test with production backend
- [ ] Verify all features working
- [ ] Fix any issues found

**Completion Criteria**: Complete system working end-to-end

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
- [ ] Use localStorage events to sync across tabs
- [ ] If user logs out in one tab, logout all tabs
- [ ] If user logs in, update all tabs
- [ ] Prevent conflicts between tabs

**Completion Criteria**: Authentication state synced across tabs

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
- ✅ Users can logout (if feature exists)
- ✅ Works on desktop and mobile browsers
- ✅ All manual tests pass
- ✅ Deployed and accessible via HTTPS
- ✅ Ready for integration with actual applications
- ✅ Documentation complete

---

## Integration with Other Apps

### Future Integration Guide

When integrating this authentication with other apps (e.g., Transcript Detective):

1. **Share Auth Context**: Import and use the same AuthProvider across apps
2. **Token Storage**: Apps share token via localStorage using the same key
3. **API Calls**: Use axios interceptors to include token in all requests
4. **Protected Routes**: Use PrivateRoute component for protected pages
5. **Shared Domain**: Host both apps on same domain for shared localStorage

**Example Integration Code**:
```javascript
// In your main app (e.g., Transcript Detective)
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;

// src/services/api.js - Axios interceptor for auth token
import axios from 'axios';
import { getToken } from './storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Notes

- Keep the frontend simple and focused on authentication
- Prioritize security over fancy features
- Test thoroughly on multiple browsers and devices
- Document everything for future developers
- Make it easy to integrate with other applications
