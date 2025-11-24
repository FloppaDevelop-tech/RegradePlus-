import React, { useState, useEffect } from 'react';
import { Search, LogOut, Upload, Eye, Edit2, Check, X, AlertCircle, CheckCircle, Trash2, ZoomIn, RotateCcw, Trash } from 'lucide-react';

// Admin Secret Code
const ADMIN_SECRET_CODE = 'ADMIN2025';

// Header Component
const Header = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    padding: '0 30px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{
        width: '35px',
        height: '35px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '20px'
      }}>R+</div>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '800',
          color: '#333',
          letterSpacing: '-0.5px'
        }}>RegradePlus+</h1>
        <span style={{
          fontSize: '12px',
          color: '#666',
          fontWeight: '500',
          display: 'block',
          marginTop: '-2px'
        }}>กลุ่มสาระการเรียนรู้วิทยาศาสตร์ & เทคโนโลยี</span>
      </div>
    </div>
  </div>
);

// Components defined outside App to prevent re-renders/state resets
const ImageViewer = ({ viewImage, onClose }) => {
  if (!viewImage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        cursor: 'pointer'
      }}
      onClick={onClose}
    >
      <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
        <img
          src={viewImage}
          alt="Full view"
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const PopupNotification = ({ popup, onClose }) => {
  if (!popup.show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: popup.type === 'success' ? '#4CAF50' : '#f44336',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '500px'
      }}>
        {popup.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        <div style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>{popup.message}</div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

const LoginPage = ({ handleLogin, handleRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', adminCode: '' });
  const [showAdminCode, setShowAdminCode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister(formData.email, formData.password, formData.name, formData.adminCode);
    } else {
      handleLogin(formData.email, formData.password);
    }
  };

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 20px',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>
              {isRegister ? 'สร้างบัญชีใหม่' : 'ยินดีต้อนรับกลับ'}
            </h2>
            <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>
              {isRegister ? 'กรอกข้อมูลเพื่อเริ่มต้นใช้งาน' : 'เข้าสู่ระบบเพื่อจัดการงานแก้ของคุณ'}
            </p>
          </div>

          {/* Custom Tabs */}
          <div style={{
            display: 'flex',
            marginBottom: '30px',
            backgroundColor: '#f0f2f5',
            padding: '4px',
            borderRadius: '14px'
          }}>
            <button
              onClick={() => setIsRegister(false)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: !isRegister ? 'white' : 'transparent',
                color: !isRegister ? '#1a1a1a' : '#666',
                boxShadow: !isRegister ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '15px'
              }}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setIsRegister(true)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: isRegister ? 'white' : 'transparent',
                color: isRegister ? '#1a1a1a' : '#666',
                boxShadow: isRegister ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '15px'
              }}
            >
              สมัครสมาชิก
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div style={{ marginBottom: '20px', animation: 'fadeIn 0.3s ease-out' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="กรอกชื่อ-นามสกุล"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #eee',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.2s',
                    backgroundColor: '#f9f9f9',
                    outline: 'none'
                  }}
                  className="input-field"
                />
              </div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>อีเมลโรงเรียน</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@taweethapisek.ac.th"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #eee',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  backgroundColor: '#f9f9f9',
                  outline: 'none'
                }}
                className="input-field"
              />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>รหัสผ่าน</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #eee',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  backgroundColor: '#f9f9f9',
                  outline: 'none'
                }}
                className="input-field"
              />
            </div>

            {isRegister && (
              <div style={{ marginBottom: '25px', animation: 'fadeIn 0.3s ease-out' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.2s' }} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showAdminCode}
                    onChange={(e) => setShowAdminCode(e.target.checked)}
                    style={{ marginRight: '10px', width: '18px', height: '18px', accentColor: '#4CAF50' }}
                  />
                  <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>ลงทะเบียนสำหรับ Admin</span>
                </label>

                {showAdminCode && (
                  <div style={{ marginTop: '15px', animation: 'slideDown 0.3s ease-out' }}>
                    <input
                      type="password"
                      value={formData.adminCode}
                      onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                      placeholder="กรอกรหัสลับ Admin"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #eee',
                        borderRadius: '12px',
                        fontSize: '15px',
                        backgroundColor: '#f9f9f9',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 10px 20px rgba(76, 175, 80, 0.2)'
              }}
              className="submit-btn"
            >
              {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const SubmitWorkPage = ({ handleSubmitWork, handleLogout, setPage, showPopup }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    studentId: '',
    subjectCode: '',
    subjectName: '',
    type: 'ศูนย์',
    gradeYear: '',
    date: new Date().toISOString().split('T')[0],
    images: []
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    })).then(images => {
      setFormData({ ...formData, images: [...formData.images, ...images] });
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, idx) => idx !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      showPopup('กรุณาอัปโหลดรูปงานอย่างน้อย 1 รูป', 'error');
      return;
    }
    handleSubmitWork(formData);
    setFormData({
      studentName: '',
      grade: '',
      studentId: '',
      subjectCode: '',
      subjectName: '',
      type: 'ศูนย์',
      gradeYear: '',
      date: new Date().toISOString().split('T')[0],
      images: []
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px 30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#2E7D32', fontSize: '24px' }}>ส่งงานแก้</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>กรอกข้อมูลให้ครบถ้วนเพื่อส่งงาน</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setPage('history')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#4CAF50',
              border: '1px solid #4CAF50',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            className="hover-green-bg"
          >
            <RotateCcw size={18} /> ประวัติการส่ง
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            className="hover-red-bg"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>ชื่อ-นามสกุล</label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              required
              placeholder="ระบุชื่อ-นามสกุล"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: '10px',
                fontSize: '15px',
                backgroundColor: '#f9f9f9',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>รหัสประจำตัว</label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
              placeholder="ระบุรหัสประจำตัว"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: '10px',
                fontSize: '15px',
                backgroundColor: '#f9f9f9',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>รหัสวิชา</label>
            <input
              type="text"
              value={formData.subjectCode}
              onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
              required
              placeholder="เช่น ว30101"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: '10px',
                fontSize: '15px',
                backgroundColor: '#f9f9f9',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>ชื่อวิชา</label>
            <input
              type="text"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              required
              placeholder="ระบุชื่อวิชา"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: '10px',
                fontSize: '15px',
                backgroundColor: '#f9f9f9',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>ประเภทงาน</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: '10px',
                fontSize: '15px',
                backgroundColor: '#f9f9f9',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ศูนย์">แก้ 0</option>
              <option value="ร">แก้ ร</option>
              <option value="มส">แก้ มส</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>เกรดเดิม</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              required
              placeholder="ระบุเกรด"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: '10px',
                fontSize: '15px',
                backgroundColor: '#f9f9f9',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>ปีการศึกษา</label>
            <input
              type="text"
              value={formData.gradeYear}
              onChange={(e) => setFormData({ ...formData, gradeYear: e.target.value })}
              required
              placeholder="เช่น 2567"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: '10px',
                fontSize: '15px',
                backgroundColor: '#f9f9f9',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '14px', color: '#333' }}>รูปภาพผลงาน</label>
          <div style={{
            border: '2px dashed #e0e0e0',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: '#fafafa'
          }}
          onClick={() => document.getElementById('file-upload').click()}
          className="hover-border-green"
          >
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <Upload size={32} color="#4CAF50" style={{ marginBottom: '10px' }} />
            <p style={{ margin: '0 0 5px 0', color: '#333', fontWeight: '500' }}>คลิกเพื่ออัปโหลดรูปภาพ</p>
            <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>รองรับไฟล์ JPG, PNG (สูงสุด 5 รูป)</p>
          </div>

          {formData.images.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                  <img
                    src={img}
                    alt={`Upload ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#ff5252',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 10px 20px rgba(76, 175, 80, 0.2)'
          }}
          className="submit-btn"
        >
          ส่งงาน
        </button>
      </form>
    </div>
  );
};

const HistoryPage = ({ userSubmissions, handleLogout, setPage, setViewImage }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px 30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#2E7D32', fontSize: '24px' }}>ประวัติการส่งงาน</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>รายการงานที่คุณส่งทั้งหมด</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setPage('submit')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#4CAF50',
              border: '1px solid #4CAF50',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            className="hover-green-bg"
          >
            <Upload size={18} /> ส่งงานใหม่
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            className="hover-red-bg"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {userSubmissions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: 'white',
            borderRadius: '16px',
            color: '#888',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <AlertCircle size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
            <p>ยังไม่มีประวัติการส่งงาน</p>
          </div>
        ) : (
          userSubmissions.map((sub) => (
            <div key={sub.id} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              transition: 'transform 0.2s',
              border: '1px solid #eee'
            }} className="hover-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#333' }}>{sub.subjectName} ({sub.subjectCode})</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    ส่งเมื่อ: {new Date(sub.submittedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  height: 'fit-content',
                  backgroundColor:
                    sub.status === 'ตรวจแล้ว' ? '#e8f5e9' :
                    sub.status === 'กำลังตรวจ' ? '#fff3e0' : '#f5f5f5',
                  color:
                    sub.status === 'ตรวจแล้ว' ? '#2e7d32' :
                    sub.status === 'กำลังตรวจ' ? '#ef6c00' : '#757575'
                }}>
                  {sub.status}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div><span style={{ color: '#888', fontSize: '13px' }}>งานประเภท:</span> <span style={{ color: '#333' }}>{sub.type}</span></div>
                <div><span style={{ color: '#888', fontSize: '13px' }}>เกรดเดิม:</span> <span style={{ color: '#333' }}>{sub.grade}</span></div>
                <div><span style={{ color: '#888', fontSize: '13px' }}>ปีการศึกษา:</span> <span style={{ color: '#333' }}>{sub.gradeYear}</span></div>
              </div>

              {sub.images && sub.images.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                  {sub.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setViewImage(img)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid #eee',
                        flexShrink: 0
                      }}
                    >
                      <img src={img} alt={`Work ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const AdminPage = ({ submissions, handleLogout, updateSubmission, deleteSubmission, restoreSubmission, permanentDeleteSubmission, setViewImage }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localSearchType, setLocalSearchType] = useState('name');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmPermanentDelete, setConfirmPermanentDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'trash'
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedCards, setExpandedCards] = useState({});

  const getFilteredSubmissions = () => {
    const filtered = submissions.filter(sub => {
      // Filter by Tab
      if (activeTab === 'active' && sub.isDeleted) return false;
      if (activeTab === 'trash' && !sub.isDeleted) return false;

      // Filter by Search
      if (!localSearchTerm) return true;
      if (localSearchType === 'name') {
        return sub.studentName.toLowerCase().includes(localSearchTerm.toLowerCase());
      } else {
        return sub.studentId.includes(localSearchTerm);
      }
    });

    const grouped = {};
    filtered.forEach(sub => {
      const key = sub.studentId;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(sub);
    });

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    });

    return grouped;
  };

  const groupedSubmissions = getFilteredSubmissions();

  const handleEdit = (submission) => {
    setEditingId(submission.id);
    setEditData(submission);
  };

  const handleSaveEdit = () => {
    updateSubmission(editingId, editData);
    setEditingId(null);
  };

  const handleDelete = (submissionId) => {
    deleteSubmission(submissionId);
    setConfirmDelete(null);
  };

  const handleRestore = (submissionId) => {
    restoreSubmission(submissionId);
  };

  const handlePermanentDelete = (submissionId) => {
    permanentDeleteSubmission(submissionId);
    setConfirmPermanentDelete(null);
  };

  const toggleCard = (studentId) => {
    setExpandedCards(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'รอตรวจ': return '#FFC107';
      case 'ตรวจแล้ว': return '#4CAF50';
      case 'แก้ไข': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin Panel</h2>
          <p style={{ margin: '5px 0', color: '#666' }}>
            จำนวนนักเรียนที่ส่งงาน: {Object.keys(groupedSubmissions).length} คน |
            งานทั้งหมด: {submissions.filter(s => !s.isDeleted).length} งาน |
            ตรวจแล้ว: {submissions.filter(s => s.status === 'ตรวจแล้ว' && !s.isDeleted).length} งาน |
            ถังขยะ: {submissions.filter(s => s.isDeleted).length} งาน
          </p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <LogOut size={16} /> ออกจากระบบ
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'active' ? '#4CAF50' : 'white',
            color: activeTab === 'active' ? 'white' : '#666',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📋 งานที่ส่ง ({submissions.filter(s => !s.isDeleted).length})
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'trash' ? '#f44336' : 'white',
            color: activeTab === 'trash' ? 'white' : '#666',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Trash size={18} /> ถังขยะ ({submissions.filter(s => s.isDeleted).length})
        </button>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <select value={localSearchType} onChange={(e) => setLocalSearchType(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '180px' }}>
          <option value="name">ค้นหาด้วยชื่อ</option>
          <option value="id">ค้นหาด้วยรหัสนักเรียน</option>
        </select>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder={`ค้นหา${localSearchType === 'name' ? 'ชื่อนักเรียน' : 'รหัสนักเรียน'}...`}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 40px 10px 10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <Search size={20} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {Object.entries(groupedSubmissions).map(([studentId, subs]) => {
          const isExpanded = expandedCards[studentId];
          const displaySubs = isExpanded ? subs : subs.slice(0, 1);

          return (
            <div key={studentId} style={{ border: '2px solid #ddd', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{subs[0].studentName}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>รหัส: {studentId} | ชั้น: {subs[0].grade}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#4CAF50' }}>{subs.length}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}> งาน</span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '15px' }}>
                {displaySubs.map(sub => (
                  <div key={sub.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0' }}>{sub.subjectName} ({sub.subjectCode})</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                          ติด {sub.type} | {sub.gradeYear}
                          <br />
                          ส่ง: {new Date(sub.submittedAt).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      {editingId === sub.id ? (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={handleSaveEdit} style={{ padding: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} style={{ padding: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {!sub.isDeleted && (
                            <button onClick={() => handleEdit(sub)} style={{ padding: '5px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                          )}
                          {sub.isDeleted ? (
                            <>
                              <button onClick={() => handleRestore(sub.id)} style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <RotateCcw size={14} /> กู้คืน
                              </button>
                              <button onClick={() => setConfirmPermanentDelete(sub.id)} style={{ padding: '6px 12px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Trash size={14} /> ลบถาวร
                              </button>
                            </>
                          ) : (
                            <button onClick={() => setConfirmDelete(sub.id)} style={{ padding: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                          )}
                        </div>
                      )}
                    </div>

                    {editingId === sub.id ? (
                      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>สถานะ:</label>
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                          >
                            <option value="รอตรวจ">รอตรวจ</option>
                            <option value="ตรวจแล้ว">ตรวจแล้ว</option>
                            <option value="แก้ไข">แก้ไข</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: getStatusColor(sub.status), color: 'white', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                        {sub.status}
                      </div>
                    )}

                    {sub.images && sub.images.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>รูปงาน ({sub.images.length} รูป):</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                          {sub.images.slice(0, 3).map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              style={{ position: 'relative', cursor: 'pointer' }}
                              onClick={() => setViewImage(img)}
                            >
                              <img
                                src={img}
                                alt={`work ${imgIdx + 1}`}
                                style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                              />
                            </div>
                          ))}
                        </div>
                        {sub.images.length > 3 && (
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px', textAlign: 'center' }}>
                            และอีก {sub.images.length - 3} รูป
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {subs.length > 1 && (
                <button
                  onClick={() => toggleCard(studentId)}
                  style={{
                    width: '100%',
                    marginTop: '15px',
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '13px'
                  }}
                >
                  {isExpanded ? 'ย่อรายการ' : `ดูทั้งหมด (${subs.length})`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modals */}
      {confirmDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <AlertCircle size={48} color="#f44336" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0' }}>ยืนยันการลบ?</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>รายการนี้จะถูกย้ายไปที่ถังขยะ</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '10px 20px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ลบรายการ</button>
            </div>
          </div>
        </div>
      )}

      {confirmPermanentDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <AlertCircle size={48} color="#d32f2f" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0' }}>ยืนยันการลบถาวร?</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>รายการนี้จะถูกลบออกจากระบบอย่างถาวรและไม่สามารถกู้คืนได้</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmPermanentDelete(null)} style={{ padding: '10px 20px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={() => handlePermanentDelete(confirmPermanentDelete)} style={{ padding: '10px 20px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ลบถาวร</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('submissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage(JSON.parse(savedUser).isAdmin ? 'admin' : 'submit');
    }
  }, []);

  // Save submissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogin = (email, password) => {
    if (email === 'admin' && password === ADMIN_SECRET_CODE) {
      const adminUser = { name: 'Admin', email: 'admin', isAdmin: true };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setPage('admin');
      showPopup('เข้าสู่ระบบผู้ดูแลระบบสำเร็จ');
      return;
    }

    // Mock login for students
    const studentUser = { name: 'Student', email, isAdmin: false, studentId: '12345' }; // Mock ID
    setUser(studentUser);
    localStorage.setItem('user', JSON.stringify(studentUser));
    setPage('submit');
    showPopup('เข้าสู่ระบบสำเร็จ');
  };

  const handleRegister = (email, password, name, adminCode) => {
     if (adminCode === ADMIN_SECRET_CODE) {
        const adminUser = { name, email, isAdmin: true };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        setPage('admin');
        showPopup('ลงทะเบียนผู้ดูแลระบบสำเร็จ');
     } else {
        const studentUser = { name, email, isAdmin: false, studentId: Math.floor(10000 + Math.random() * 90000).toString() };
        setUser(studentUser);
        localStorage.setItem('user', JSON.stringify(studentUser));
        setPage('submit');
        showPopup('ลงทะเบียนสำเร็จ');
     }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setUser(null);
    setPage('login');
    localStorage.removeItem('user');
    setShowLogoutConfirm(false);
    showPopup('ออกจากระบบเรียบร้อย');
  };

  const handleSubmitWork = (data) => {
    const newSubmission = {
      id: Date.now().toString(),
      ...data,
      status: 'รอตรวจ',
      submittedAt: new Date().toISOString(),
      isDeleted: false
    };
    setSubmissions([newSubmission, ...submissions]);
    setPage('history');
    showPopup('ส่งงานเรียบร้อย');
  };

  const updateSubmission = (id, data) => {
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === id) {
        const updated = { ...sub, ...data };
        if (data.status === 'ตรวจแล้ว' && sub.status !== 'ตรวจแล้ว') {
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }
      return sub;
    });
    setSubmissions(updatedSubmissions);
    showPopup('อัปเดตข้อมูลเรียบร้อย');
  };

  const deleteSubmission = (id) => {
    const updatedSubmissions = submissions.map(sub =>
      sub.id === id ? { ...sub, isDeleted: true, deletedAt: new Date().toISOString() } : sub
    );
    setSubmissions(updatedSubmissions);
    showPopup('ย้ายไปถังขยะแล้ว');
  };

  const restoreSubmission = (id) => {
    const updatedSubmissions = submissions.map(sub =>
      sub.id === id ? { ...sub, isDeleted: false, deletedAt: null } : sub
    );
    setSubmissions(updatedSubmissions);
    showPopup('กู้คืนรายการเรียบร้อย');
  };

  const permanentDeleteSubmission = (id) => {
    const updatedSubmissions = submissions.filter(sub => sub.id !== id);
    setSubmissions(updatedSubmissions);
    showPopup('ลบรายการถาวรแล้ว');
  };

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif", backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      <Header user={user} handleLogout={handleLogout} />

      {popup.show && <PopupNotification message={popup.message} type={popup.type} onClose={() => setPopup({ ...popup, show: false })} />}

      {viewImage && <ImageViewer src={viewImage} onClose={() => setViewImage(null)} />}

      {page === 'login' && <LoginPage handleLogin={handleLogin} handleRegister={handleRegister} />}

      {page === 'submit' && (
        <SubmitWorkPage
          handleSubmitWork={handleSubmitWork}
          handleLogout={handleLogout}
          setPage={setPage}
          showPopup={showPopup}
        />
      )}

      {page === 'history' && (
        <HistoryPage
          userSubmissions={submissions.filter(s => s.studentId === user.studentId)}
          handleLogout={handleLogout}
          setPage={setPage}
          setViewImage={setViewImage}
        />
      )}

      {page === 'admin' && (
        <AdminPage
          submissions={submissions}
          handleLogout={handleLogout}
          updateSubmission={updateSubmission}
          deleteSubmission={deleteSubmission}
          restoreSubmission={restoreSubmission}
          permanentDeleteSubmission={permanentDeleteSubmission}
          setViewImage={setViewImage}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '16px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            animation: 'scaleIn 0.2s ease-out'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ffebee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#d32f2f'
            }}>
              <LogOut size={30} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#333' }}>ยืนยันการออกจากระบบ?</h3>
            <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>
              คุณต้องการออกจากระบบใช่หรือไม่?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#666',
                  flex: 1,
                  transition: 'all 0.2s'
                }}
                className="hover-gray-bg"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  flex: 1,
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                  transition: 'all 0.2s'
                }}
                className="hover-red-dark-bg"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;