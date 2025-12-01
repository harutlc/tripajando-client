import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Auth0Provider} from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID

// Validate Auth0 configuration
if (!domain || !clientId) {
    console.error('Auth0 configuration missing. Please check your .env file.')
    console.error('Required environment variables:')
    console.error('- VITE_AUTH0_DOMAIN')
    console.error('- VITE_AUTH0_CLIENT_ID')
}

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('Root element not found')
}

const onRedirectCallback = (appState: any) => {
    // Redirect to dashboard after successful authentication
    window.history.replaceState(
        {},
        document.title,
        appState?.returnTo || '/'
    );
};

createRoot(rootElement).render(
    <StrictMode>
        <Auth0Provider
            domain={domain || ''}
            clientId={clientId || ''}
            authorizationParams={{
                redirect_uri: window.location.origin + "/callback",
                audience: "https://api.tribajando.com", // Your API identifier
                scope: "openid profile email" // Add any custom scopes you need
            }}
            onRedirectCallback={onRedirectCallback}
        >
            <App/>
        </Auth0Provider>
    </StrictMode>,
)
