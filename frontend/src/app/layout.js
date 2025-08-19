import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AppLayout from './components/AppLayout'
import { AuthProvider } from './context/AuthContext'

export const metadata = {
  title: "Delish",
  description: "Web app for recipe search, recipe management, and shopping list planning",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
