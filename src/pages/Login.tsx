'use client';

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { CheckBoxComponent, ButtonComponent } from '@syncfusion/ej2-react-buttons';
import axios from 'axios';
import '../global.css';



const apiBaseUrl = process.env.REACT_APP_WEB_API_URL;

interface LoginProps {
    onLogin: () => void;
}



export default function LoginForm({ onLogin }: { onLogin: () => void }) { // Renamed to LoginForm and receive onLogin prop

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [totpCode, setTotpCode] = useState('');
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [showQRCode, setShowQRCode] = useState<boolean>(false);
    const totpInputRef = useRef<TextBoxComponent>(null);


    useEffect(() => {
        if (step === 3 && totpInputRef.current) {
            totpInputRef.current?.focusIn();
        }
    }, [step]);

    const handleLogin = async () => {
        setError('');
        try {
            const response = await axios.post(`${apiBaseUrl}api/user/validate`, { email, password });
            const userData = response.data;
            setUser(userData);

            if (userData.isTOTPEnabled) {
                if (userData.totpSecret === null) {
                    setStep(2);
                    setupTOTP();
                } else {
                    setStep(3);
                }
            } else {
                if (userData.token) {
                    localStorage.setItem("jwttoken", userData.token);
                    localStorage.setItem("isTOTPEnabled", userData.isTOTPEnabled);
                    localStorage.setItem('isLoggedIn','true');
                }
                onLogin(); // Call onLogin here
                navigate('/dashboard');
            }
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    const setupTOTP = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}api/user/setup-totp`, { email });
            setQrCode(response.data);
        } catch (err) {
            setError('Error setting up TOTP.');
        }
    };

    const handleVerifyTOTP = async () => {
        setError('');
        try {
            const response = await axios.post(`${apiBaseUrl}api/user/verify-totp`, {
                recid: user.recid,
                totpCode,
            });

            if (response.data.success) {
                if (user.token) {
                    localStorage.setItem("jwttoken", user.token);
                    localStorage.setItem("isTOTPEnabled", user.isTOTPEnabled);
                    localStorage.setItem('isLoggedIn','true');
                }
                onLogin(); // Call onLogin here
                navigate('/dashboard');
            } else {
                setError('Invalid TOTP Code');
            }
        } catch (err) {
            setError('Invalid TOTP Code');
        }
    };

    const handleQRCodeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        generateQRCode(); // Trigger QR code generation
        setShowQRCode(true); // Show the QR code after clicking the link

    };
    const generateQRCode = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}api/user/resend-qrcode`, {
                params: { email },
          });
          setQrCode(response.data); // Extract the correct string value
          console.log(response.data);
        } catch (err) {
          console.error("Error generating QR code:", err);
        }
      };

    return (
        <section className="bg-gray-200 dark:bg-gray-950 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl px-6 py-8 shadow-lg">
                <div className="flex justify-center mb-6">
                    <img src="cpmsoftsvg.svg" width={128} height={128} alt="company logo" />
                </div>

                {step === 1 && (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-2">Sign in</h2>
                        <p className="text-md text-center text-gray-700 dark:text-gray-300 mb-4">Enter your credentials</p>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <TextBoxComponent cssClass="e-bigger" type="email" placeholder="Email" value={email} change={(e) => setEmail(e.value)} />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <TextBoxComponent cssClass="e-bigger" type="password" placeholder="Password" value={password} change={(e) => setPassword(e.value)} />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <CheckBoxComponent cssClass="e-bigger" label="Remember me" />
                            <a href="#" className="text-primary-600 dark:text-primary-400 font-medium text-sm">Forgot password?</a>
                        </div>
                        <ButtonComponent className="w-full e-primary" type="button" onClick={handleLogin}>Sign in</ButtonComponent>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-2">Set up TOTP</h2>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <p className="text-center text-gray-700 dark:text-gray-300 mb-4">Scan the QR code with Google Authenticator.</p>
                        <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                             {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" style={{ width: '150px', height: '150px',alignContent:'center' }} />}
                        </div>
                        <ButtonComponent className="w-full e-primary" type="button" onClick={() => setStep(3)}>Proceed</ButtonComponent>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-2">Enter TOTP Code</h2>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">TOTP Code</label>
                            <TextBoxComponent
                                cssClass="e-bigger"
                                type="text"
                                placeholder="Enter TOTP Code"
                                value={totpCode}
                                change={(e) => setTotpCode(e.value)}
                                ref={totpInputRef}
                            />
                        </div>
                        <ButtonComponent className="w-full e-primary" type="button" onClick={handleVerifyTOTP}>Verify</ButtonComponent>
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <p>
                                Need to rescan the QR code?{' '}
                                <a
                                href="#displayQRCode"
                                onClick={handleQRCodeClick} // Handle the click to generate and show the QR code
                                style={{ color: 'blue', textDecoration: 'underline' }}

                                >
                                QRCode
                                </a>
                            </p>
                            {/* Show QR code only if it's generated */}
                            {showQRCode && qrCode && (
                                <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" style={{ width: '150px', height: '150px',alignContent:'center' }} />
                                <p>Scan this QR code with your Google Authenticator app.</p>
                                </div>
                            )}
                        </div>                        
                    </>
                )}
            </div>
        </section>
    );
}
