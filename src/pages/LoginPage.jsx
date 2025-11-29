import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ onLogin, onRegister, onGoogleSignIn }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '', adminCode: '' });
    const [showAdminCode, setShowAdminCode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            onRegister(formData);
        } else {
            onLogin(formData.email, formData.password);
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <div className="text-center" style={{ marginBottom: '30px' }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: 'var(--text-primary)' }}>
                        {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {isRegister ? 'สร้างบัญชีใหม่เพื่อเริ่มใช้งาน' : 'ยินดีต้อนรับกลับมา'}
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <label className="form-label">ชื่อ-นามสกุล</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="form-input" />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="yourname@taweethapisek.ac.th" required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="form-input"
                                style={{ paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {isRegister && (
                        <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', transition: 'all 0.3s' }}>
                                <input type="checkbox" checked={showAdminCode} onChange={(e) => setShowAdminCode(e.target.checked)} style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }} />
                                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>ฉันเป็น Admin (ต้องมีรหัส Admin)</span>
                            </label>
                            {showAdminCode && (
                                <div style={{ marginTop: '12px', animation: 'fadeIn 0.3s ease-out' }}>
                                    <label className="form-label">รหัส Admin</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showAdminPassword ? "text" : "password"}
                                            value={formData.adminCode}
                                            onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                                            placeholder="กรุณาใส่รหัส Admin"
                                            className="form-input"
                                            style={{ paddingRight: '45px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--text-secondary)',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '10px' }}>
                        {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                {/* Google Sign-In */}
                {!isRegister && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '12px' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>หรือ</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                        </div>
                        <button
                            type="button"
                            onClick={onGoogleSignIn}
                            className="btn btn-full"
                            style={{
                                backgroundColor: 'white',
                                color: '#333',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                fontWeight: '500',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#999';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                            </svg>
                            เข้าสู่ระบบด้วย Google
                        </button>
                    </>
                )}

                <div className="text-center" style={{ marginTop: '24px', padding: '20px 0', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {isRegister ? 'มีบัญชีแล้ว?' : 'ยังไม่มีบัญชี?'}
                    </span>
                    <button onClick={() => {
                        setIsRegister(!isRegister);
                        setFormData({ email: '', password: '', name: '', adminCode: '' });
                        setShowAdminCode(false);
                        setShowPassword(false);
                        setShowAdminPassword(false);
                    }} className="btn-outline" type="button">
                        {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
