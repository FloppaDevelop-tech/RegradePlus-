import React, { useState, useEffect } from 'react';

import { Search, LogOut, Upload, Eye, Edit2, Check, X } from 'lucide-react';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  // Admin Secret Code
  const ADMIN_SECRET_CODE = 'ADMIN2025'; // เปลี่ยนรหัสนี้ได้ตามต้องการ

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const usersData = localStorage.getItem('users');
      const submissionsData = localStorage.getItem('submissions');
      
      if (usersData) setUsers(JSON.parse(usersData));
      if (submissionsData) setSubmissions(JSON.parse(submissionsData));
    } catch (error) {
      console.log('No data found, starting fresh');
    }
  };

  const saveUsers = (newUsers) => {
    localStorage.setItem('users', JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const saveSubmissions = (newSubmissions) => {
    localStorage.setItem('submissions', JSON.stringify(newSubmissions));
    setSubmissions(newSubmissions);
  };

  // Auth Functions
  const handleRegister = (email, password, name, adminCode = '') => {
    if (!email.endsWith('@taweethapisek.ac.th')) {
      alert('กรุณาใช้ Email โรงเรียน (@taweethapisek.ac.th)');
      return;
    }

    // ตรวจสอบว่าจะเป็น Admin หรือไม่
    const isAdmin = adminCode === ADMIN_SECRET_CODE;
    
    if (adminCode && !isAdmin) {
      alert('รหัส Admin ไม่ถูกต้อง');
      return;
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่
    if (users.find(u => u.email === email)) {
      alert('Email นี้ถูกใช้งานแล้ว');
      return;
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      isAdmin
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    alert(isAdmin ? 'สมัครสมาชิก Admin สำเร็จ!' : 'สมัครสมาชิกสำเร็จ!');
    setPage('login');
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setPage(user.isAdmin ? 'admin' : 'submit');
    } else {
      alert('Email หรือ Password ไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('login');
  };

  // Submit Work
  const handleSubmitWork = (workData) => {
    const newSubmission = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: workData.studentName,
      studentId: workData.studentId,
      ...workData,
      submittedAt: new Date().toISOString(),
      status: 'ยังไม่ตรวจ'
    };
    
    const updatedSubmissions = [...submissions, newSubmission];
    saveSubmissions(updatedSubmissions);
    alert('ส่งงานสำเร็จ!');
    setPage('history');
  };

  // Admin Functions
  const updateSubmissionStatus = (submissionId, newStatus) => {
    const updatedSubmissions = submissions.map(sub =>
      sub.id === submissionId ? { ...sub, status: newStatus } : sub
    );
    saveSubmissions(updatedSubmissions);
  };

  const updateSubmission = (submissionId, updatedData) => {
    const updatedSubmissions = submissions.map(sub =>
      sub.id === submissionId ? { ...sub, ...updatedData } : sub
    );
    saveSubmissions(updatedSubmissions);
  };

  // Get user submissions
  const getUserSubmissions = () => {
    return submissions.filter(sub => sub.userId === currentUser.id);
  };

  // Group submissions by student for admin
  const getGroupedSubmissions = () => {
    const filtered = submissions.filter(sub => {
      if (!searchTerm) return true;
      if (searchType === 'name') {
        return sub.userName.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return sub.studentId.includes(searchTerm);
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
    
    // เรียงงานจากใหม่ไปเก่า
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    });
    
    return grouped;
  };

  // Components
  const LoginPage = () => {
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
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อ-นามสกุล:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          )}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="yourname@taweethapisek.ac.th"
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          {isRegister && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={showAdminCode}
                  onChange={(e) => setShowAdminCode(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                ฉันเป็น Admin (ต้องมีรหัส Admin)
              </label>
              
              {showAdminCode && (
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัส Admin:</label>
                  <input
                    type="password"
                    value={formData.adminCode}
                    onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                    placeholder="กรุณาใส่รหัส Admin"
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              )}
            </div>
          )}
          
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px' }}>
            {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {isRegister ? 'มีบัญชีแล้ว?' : 'ยังไม่มีบัญชี?'}
          <button onClick={() => {
            setIsRegister(!isRegister);
            setFormData({ email: '', password: '', name: '', adminCode: '' });
            setShowAdminCode(false);
          }} style={{ marginLeft: '5px', background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}>
            {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </p>
      </div>
    );
  };

  const SubmitWorkPage = () => {
    const [formData, setFormData] = useState({
      studentName: '',
      grade: '',
      studentId: '',
      subjectCode: '',
      subjectName: '',
      type: 'ศูนย์',
      year: new Date().getFullYear() + 543,
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
        alert('กรุณาอัปโหลดรูปงานอย่างน้อย 1 รูป');
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
        year: new Date().getFullYear() + 543,
        date: new Date().toISOString().split('T')[0],
        images: []
      });
    };

    return (
      <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>ส่งงานแก้</h2>
          <div>
            <button onClick={() => setPage('history')} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ประวัติ</button>
            <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={16} /> ออกจากระบบ
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '30px', backgroundColor: 'white', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อ-นามสกุล: *</label>
              <input type="text" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชั้น: *</label>
              <input type="text" placeholder="เช่น ม.4/1" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสนักเรียน: *</label>
              <input type="text" placeholder="เช่น 12345" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสวิชา: *</label>
              <input type="text" placeholder="เช่น ค21101" value={formData.subjectCode} onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อวิชา: *</label>
              <input type="text" placeholder="เช่น คณิตศาสตร์" value={formData.subjectName} onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ติด: *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="ศูนย์">ศูนย์</option>
                <option value="ร.">ร.</option>
                <option value="มส.">มส.</option>
                <option value="มพ.">มพ.</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ปี (พ.ศ.): *</label>
              <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>วันที่ส่ง: *</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รูปงานแก้: *</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            {formData.images.length > 0 && (
              <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                {formData.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={img} alt={`preview ${idx}`} style={{ width: '100%', height: '120px', objectFit: 'cover', border: '2px solid #ddd', borderRadius: '4px' }} />
                    <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', fontSize: '16px' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" style={{ marginTop: '25px', padding: '12px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Upload size={18} /> ส่งงาน
          </button>
        </form>
      </div>
    );
  };

  const HistoryPage = () => {
    const userSubmissions = getUserSubmissions().sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const getStatusColor = (status) => {
      switch(status) {
        case 'ตรวจแล้ว': return '#4CAF50';
        case 'กำลังตรวจ': return '#2196F3';
        default: return '#FFC107';
      }
    };

    return (
      <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>ประวัติการส่งงาน</h2>
          <div>
            <button onClick={() => setPage('submit')} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ส่งงานใหม่</button>
            <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={16} /> ออกจากระบบ
            </button>
          </div>
        </div>
        {userSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>ยังไม่มีประวัติการส่งงาน</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {userSubmissions.map(sub => (
              <div key={sub.id} style={{ border: '1px solid #ddd', padding: '20px', cursor: 'pointer', backgroundColor: 'white', borderRadius: '8px', transition: 'transform 0.2s' }} onClick={() => setSelectedSubmission(sub)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{sub.subjectName} ({sub.subjectCode})</h3>
                    <p style={{ margin: '5px 0', color: '#666' }}>ติด {sub.type} | ส่งเมื่อ {new Date(sub.submittedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <p style={{ margin: '5px 0', color: '#666' }}>รูปงาน: {sub.images?.length || 0} รูป</p>
                  </div>
                  <div style={{ padding: '8px 16px', backgroundColor: getStatusColor(sub.status), color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                    {sub.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedSubmission && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedSubmission(null)}>
            <div style={{ backgroundColor: 'white', padding: '30px', maxWidth: '700px', maxHeight: '85vh', overflow: 'auto', borderRadius: '8px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginTop: 0, borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>รายละเอียดงาน</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div><strong>ชื่อ:</strong> {selectedSubmission.studentName}</div>
                <div><strong>ชั้น:</strong> {selectedSubmission.grade}</div>
                <div><strong>รหัสนักเรียน:</strong> {selectedSubmission.studentId}</div>
                <div><strong>รหัสวิชา:</strong> {selectedSubmission.subjectCode}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>ชื่อวิชา:</strong> {selectedSubmission.subjectName}</div>
                <div><strong>ติด:</strong> {selectedSubmission.type}</div>
                <div><strong>ปี:</strong> {selectedSubmission.year}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>วันที่ส่ง:</strong> {new Date(selectedSubmission.date).toLocaleDateString('th-TH')}</div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>สถานะ:</strong> 
                  <span style={{ marginLeft: '10px', padding: '5px 12px', backgroundColor: getStatusColor(selectedSubmission.status), color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>
              
              {selectedSubmission.images && selectedSubmission.images.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <strong style={{ display: 'block', marginBottom: '10px' }}>รูปงาน ({selectedSubmission.images.length} รูป):</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    {selectedSubmission.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`work ${idx + 1}`} style={{ width: '100%', height: '200px', objectFit: 'cover', border: '2px solid #ddd', borderRadius: '4px' }} />
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => setSelectedSubmission(null)} style={{ marginTop: '25px', padding: '12px 20px', width: '100%', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>ปิด</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const AdminPage = () => {
    const groupedSubmissions = getGroupedSubmissions();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [expandedCards, setExpandedCards] = useState({});

    const handleEdit = (submission) => {
      setEditingId(submission.id);
      setEditData(submission);
    };

    const handleSaveEdit = () => {
      updateSubmission(editingId, editData);
      setEditingId(null);
    };

    const toggleCard = (studentId) => {
      setExpandedCards(prev => ({
        ...prev,
        [studentId]: !prev[studentId]
      }));
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'ตรวจแล้ว': return '#4CAF50';
        case 'กำลังตรวจ': return '#2196F3';
        default: return '#FFC107';
      }
    };

    return (
      <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0 }}>Admin Panel</h2>
            <p style={{ margin: '5px 0', color: '#666' }}>จำนวนนักเรียนที่ส่งงาน: {Object.keys(groupedSubmissions).length} คน | งานทั้งหมด: {submissions.length} งาน</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
        <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '180px' }}>
            <option value="name">ค้นหาด้วยชื่อ</option>
            <option value="id">ค้นหาด้วยรหัสนักเรียน</option>
          </select>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder={`ค้นหา${searchType === 'name' ? 'ชื่อนักเรียน' : 'รหัสนักเรียน'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{subs[0].studentName}</h3>
                  <p style={{ color: '#666', margin: '0' }}>รหัส: {studentId} | ชั้น: {subs[0].grade}</p>
                </div>
                
                <div style={{ backgroundColor: '#2196F3', color: 'white', padding: '10px', marginBottom: '10px', borderRadius: '4px', fontWeight: 'bold', textAlign: 'center' }}>
                  งานทั้งหมด: {subs.length} งาน
                </div>
                
                {displaySubs.map((sub, idx) => (
                  <div key={sub.id} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>
                      งานที่ {subs.length - subs.indexOf(sub)} - {new Date(sub.submittedAt).toLocaleString('th-TH')}
                    </div>
                    
                    {editingId === sub.id ? (
                      <div style={{ fontSize: '14px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '3px' }}>ชื่อวิชา:</label>
                          <input type="text" value={editData.subjectName} onChange={(e) => setEditData({ ...editData, subjectName: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '3px' }}>รหัสวิชา:</label>
                          <input type="text" value={editData.subjectCode} onChange={(e) => setEditData({ ...editData, subjectCode: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '3px' }}>สถานะ:</label>
                          <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value="ยังไม่ตรวจ">ยังไม่ตรวจ</option>
                            <option value="กำลังตรวจ">กำลังตรวจ</option>
                            <option value="ตรวจแล้ว">ตรวจแล้ว</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={handleSaveEdit} style={{ flex: 1, padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <Check size={16} /> บันทึก
                          </button>
                          <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <X size={16} /> ยกเลิก
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '14px' }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '15px' }}>{sub.subjectName}</p>
                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>รหัสวิชา: {sub.subjectCode}</p>
                        <p style={{ margin: '0 0 10px 0', color: '#666' }}>ติด {sub.type} - ปี {sub.year}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <span style={{ padding: '5px 12px', backgroundColor: getStatusColor(sub.status), color: 'white', fontSize: '12px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {sub.status}
                          </span>
                          <button onClick={() => handleEdit(sub)} style={{ padding: '6px 12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Edit2 size={14} /> แก้ไข
                          </button>
                        </div>
                        
                        {sub.images && sub.images.length > 0 && (
                          <div style={{ marginTop: '12px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>รูปงาน ({sub.images.length} รูป):</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                              {sub.images.slice(0, 3).map((img, imgIdx) => (
                                <img key={imgIdx} src={img} alt={`work ${imgIdx + 1}`} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
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
                    )}
                  </div>
                ))}
                
                {subs.length > 1 && (
                  <button onClick={() => toggleCard(studentId)} style={{ width: '100%', padding: '10px', backgroundColor: '#607D8B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isExpanded ? `ซ่อน (${subs.length - 1} งาน)` : `ดูทั้งหมด (${subs.length} งาน)`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {Object.keys(groupedSubmissions).length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
            <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
              {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีงานที่ส่งมา'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {!currentUser && <LoginPage />}
      {currentUser && !currentUser.isAdmin && page === 'submit' && <SubmitWorkPage />}
      {currentUser && !currentUser.isAdmin && page === 'history' && <HistoryPage />}
      {currentUser && currentUser.isAdmin && <AdminPage />}
    </div>
  );
};

export default App;

