import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Use ref to prevent double verification calls
  const hasVerified = useRef(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    // Prevent double verification in React Strict Mode
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;
    verifyEmail(token);
  }, [token]);

  // Countdown effect for redirect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'success' && countdown > 0 && !isRedirecting) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsRedirecting(true);
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, countdown, navigate, isRedirecting]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      console.log('Starting email verification with token:', verificationToken);
      
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/auth/verify-email?token=${verificationToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log('Verification response:', { status: response.status, data });

      if (response.ok) {
        console.log('Verification successful');
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        setUserInfo(data.user);
        
        // Store tokens for automatic login
        if (data.accessToken && data.refreshToken) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('Tokens stored successfully');
        }
      } else {
        console.log('Verification failed:', data.message);
        
        // Check if this might be a double-call issue
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        
        if (storedUser && storedToken) {
          console.log('Found existing tokens, user might already be verified');
          const user = JSON.parse(storedUser);
          if (user.isEmailVerified) {
            console.log('User is already verified, showing success');
            setStatus('success');
            setMessage('Email already verified! You are logged in.');
            setUserInfo(user);
            return;
          }
        }
        
        setStatus('error');
        setMessage(data.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    navigate('/dashboard');
  };

  const resendVerificationEmail = async () => {
    if (!userInfo?.email) {
      setMessage('Unable to resend email. Please try registering again.');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userInfo.email }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Verification email sent successfully! Please check your inbox.');
      } else {
        setMessage(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Failed to resend verification email. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-neumorphic p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo className="h-12" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat">
            Email Verification
          </h1>

          {/* Loading State */}
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
              </div>
              <p className="text-gray-600 font-poppins">
                Verifying your email address...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-green-600 font-montserrat">
                  Email Verified Successfully!
                </h2>
                <p className="text-gray-600 font-poppins">
                  {message}
                </p>
                {userInfo && (
                  <p className="text-sm text-gray-500 font-poppins">
                    Welcome, {userInfo.firstName}! You are now logged in.
                  </p>
                )}
              </div>
              
              {!isRedirecting && (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700 font-poppins">
                      Redirecting to your dashboard in {countdown} seconds...
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={handleManualRedirect}
                      className="w-full"
                      variant="primary"
                    >
                      Go to Dashboard Now
                    </Button>
                    <Button
                      onClick={() => setCountdown(0)}
                      variant="outline"
                      className="w-full"
                    >
                      Cancel Auto-redirect
                    </Button>
                  </div>
                </>
              )}

              {isRedirecting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    <p className="text-sm text-blue-700 font-poppins">
                      Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-red-600 font-montserrat">
                  Verification Failed
                </h2>
                <p className="text-gray-600 font-poppins">
                  {message}
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-700 font-poppins">
                    <p className="font-medium mb-1">Common issues:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>The verification link may have expired</li>
                      <li>The link may have been used already</li>
                      <li>The token may be invalid or corrupted</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex space-x-3">
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Login
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    variant="secondary"
                    className="flex-1"
                  >
                    Register Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-poppins">
              Need help?{' '}
              <Link 
                to="/contact" 
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;