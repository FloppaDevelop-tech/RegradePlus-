import React, { useState } from 'react';
import { User, Lock, Save, X, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ProfilePage = ({ user, onUpdate, onChangePassword, onNavigate, previousPage }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if user signed in with Google (no password)
    const isGoogleUser = !user?.password || user?.password === '';

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        if (formData.name.trim() === '') {
            setError('กรุณากรอกชื่อ-นามสกุล');
            return;
        }
        onUpdate(formData);
        setSuccess('อัปเดตข้อมูลสำเร็จ');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('รหัสผ่านใหม่ไม่ตรงกัน');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        onChangePassword(passwordData.oldPassword, passwordData.newPassword);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
        setSuccess('เปลี่ยนรหัสผ่านสำเร็จ');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onNavigate(previousPage || (user?.isAdmin ? 'admin' : 'history'));
    };

    return (
        <div className="login-container">
            <div className="form-container" style={{ maxWidth: '500px', position: 'relative', paddingTop: '60px' }}>
                {/* Back Button - Inside container, top left */}
                <button
                    type="button"
                    onClick={handleBackClick}
                    className="back-button"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        zIndex: 10
                    }}
                >
                    <ArrowLeft size={16} />
                    กลับ
                </button>

                {/* Header */}
                <div className="text-center" style={{ marginBottom: '30px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#4CAF50',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }}>
                        <User size={40} style={{ color: 'white' }} />
                    </div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: 'var(--text-primary)' }}>
                        โปรไฟล์
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                        จัดการข้อมูลส่วนตัวของคุณ
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div style={{
                        padding: '12px 16px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #c3e6cb',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        ✓ {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #f5c6cb',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        ✕ {error}
                    </div>
                )}

                {/* Profile Information */}
                <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                        <label className="form-label">ชื่อ-นามสกุล</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">อีเมล</label>
                        <input
                            type="email"
                            value={formData.email}
                            className="form-input"
                            disabled
                            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed', opacity: 0.7 }}
                        />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                            * ไม่สามารถเปลี่ยนอีเมลได้
                        </small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">บทบาท</label>
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: user?.isAdmin ? '#e8f5e9' : '#e3f2fd',
                            border: `1px solid ${user?.isAdmin ? '#4CAF50' : '#2196F3'}`,
                            borderRadius: '8px',
                            color: user?.isAdmin ? '#2e7d32' : '#1565c0',
                            fontWeight: '500',
                            textAlign: 'center'
                        }}>
                            {user?.isAdmin ? '👨‍💼 ผู้ดูแลระบบ (Admin)' : '👨‍🎓 นักเรียน (Student)'}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '10px' }}>
                        <Save size={18} style={{ marginRight: '8px' }} />
                        บันทึกข้อมูล
                    </button>
                </form>

                {/* Divider */}
                <div style={{
                    margin: '30px 0',
                    borderTop: '1px solid var(--border-color)',
                    position: 'relative'
                }}>
                    <span style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'white',
                        padding: '0 16px',
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                    }}>
                        หรือ
                    </span>
                </div>

                {/* Password Change Section - Only for non-Google users */}
                {!isGoogleUser ? (
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '20px',
                            padding: '16px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <Lock size={24} style={{ color: '#4CAF50' }} />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>เปลี่ยนรหัสผ่าน</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    อัปเดตรหัสผ่านของคุณเพื่อความปลอดภัย
                                </p>
                            </div>
                        </div>

                        {!showPasswordSection ? (
                            <button
                                onClick={() => setShowPasswordSection(true)}
                                className="btn btn-outline btn-full"
                                type="button"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <Lock size={16} />
                                เปลี่ยนรหัสผ่าน
                            </button>
                        ) : (
                            <form onSubmit={handlePasswordChange} style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                <div className="form-group">
                                    <label className="form-label">รหัสผ่านเดิม</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="form-input"
                                            style={{ paddingRight: '45px' }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
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
                                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">รหัสผ่านใหม่</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="form-input"
                                            style={{ paddingRight: '45px' }}
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
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
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <small style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                        * รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">ยืนยันรหัสผ่านใหม่</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="form-input"
                                            style={{ paddingRight: '45px' }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Save size={16} />
                                        บันทึกรหัสผ่าน
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordSection(false);
                                            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                            setError('');
                                            setShowOldPassword(false);
                                            setShowNewPassword(false);
                                            setShowConfirmPassword(false);
                                        }}
                                        className="btn btn-secondary"
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <X size={16} />
                                        ยกเลิก
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#e3f2fd',
                        border: '1px solid #2196F3',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <Lock size={24} style={{ color: '#2196F3' }} />
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#1565c0' }}>เข้าสู่ระบบด้วย Google</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#1976d2' }}>
                                คุณเข้าสู่ระบบด้วย Google Account ไม่จำเป็นต้องตั้งรหัสผ่าน
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
