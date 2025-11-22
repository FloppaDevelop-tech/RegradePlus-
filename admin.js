// admin.js - Admin Panel Logic (Simple Version)

let allSubmissions = [];

// โหลดข้อมูลเมื่อเปิดหน้า
document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (!user || user.email !== "admin.regradeplus@gmail.com") {
            alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
            window.location.href = "index.html";
            return;
        }
        loadSubmissions();
    });
});

// โหลดข้อมูลทั้งหมด
function loadSubmissions() {
    const container = document.getElementById('submissions-list');
    const filterStatus = document.getElementById('filter-status').value;
    
    container.innerHTML = 'กำลังโหลด...';

    let query = db.collection('submits').orderBy('timestamp', 'desc');

    if (filterStatus !== 'all') {
        query = query.where('status', '==', filterStatus);
    }

    query.get()
        .then(snapshot => {
            if (snapshot.empty) {
                container.innerHTML = 'ไม่มีข้อมูล';
                updateStats(0, 0, 0, 0);
                return;
            }

            allSubmissions = [];
            snapshot.forEach(doc => {
                allSubmissions.push({ id: doc.id, ...doc.data() });
            });

            // คำนวณสถิติ
            const total = allSubmissions.length;
            const pending = allSubmissions.filter(s => s.status === 'รอตรวจ').length;
            const approved = allSubmissions.filter(s => s.status === 'ตรวจแล้ว').length;
            const rejected = allSubmissions.filter(s => s.status === 'ไม่ผ่าน').length;
            updateStats(total, pending, approved, rejected);

            renderSubmissions(allSubmissions);
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = 'เกิดข้อผิดพลาด: ' + err.message;
        });
}

// แสดงข้อมูล
function renderSubmissions(submissions) {
    const container = document.getElementById('submissions-list');
    
    if (submissions.length === 0) {
        container.innerHTML = 'ไม่พบข้อมูล';
        return;
    }

    container.innerHTML = '';

    submissions.forEach(data => {
        const div = document.createElement('div');
        div.style.margin = '20px 0';
        div.style.padding = '15px';
        div.style.border = '2px solid #ddd';
        div.style.borderRadius = '8px';

        const timestamp = data.timestamp ? 
            new Date(data.timestamp.toDate()).toLocaleString('th-TH') : 
            'ไม่ทราบเวลา';

        // สร้าง HTML รูปภาพ
        let imagesHtml = '';
        if (data.images && data.images.length > 0) {
            imagesHtml = '<div style="margin: 10px 0;"><strong>รูปภาพ:</strong><br>';
            data.images.forEach((img, idx) => {
                const imgSrc = typeof img === 'string' ? img : img.data;
                const imgName = typeof img === 'string' ? `รูปที่ ${idx + 1}` : img.name;
                
                imagesHtml += `
                    <img src="${imgSrc}" 
                         style="width: 150px; height: 150px; object-fit: cover; margin: 5px; border: 1px solid #ccc; cursor: pointer;" 
                         onclick="openModal('${imgSrc}')"
                         title="${imgName}">
                `;
            });
            imagesHtml += '</div>';
        }

        // เลือกสีตามสถานะ
        let statusColor = 'orange';
        if (data.status === 'ตรวจแล้ว') statusColor = 'green';
        if (data.status === 'ไม่ผ่าน') statusColor = 'red';

        div.innerHTML = `
            <h3>${data.subjectName || 'ไม่มีชื่อวิชา'} (${data.subjectCode || '-'})</h3>
            <p><strong>สถานะ:</strong> <span style="color: ${statusColor}; font-weight: bold;">${data.status || 'รอตรวจ'}</span></p>
            <p><strong>ชื่อ:</strong> ${data.name || '-'}</p>
            <p><strong>ชั้น:</strong> ${data.classRoom || '-'}</p>
            <p><strong>รหัส นร.:</strong> ${data.studentId || '-'}</p>
            <p><strong>ปีการศึกษา:</strong> ${data.year || '-'}</p>
            <p><strong>ส่งเมื่อ:</strong> ${timestamp}</p>
            <p><strong>จำนวนรูป:</strong> ${data.imageCount || data.images.length} รูป</p>
            ${imagesHtml}
            <div style="margin-top: 15px;">
                <button onclick="updateStatus('${data.id}', 'ตรวจแล้ว')" style="padding: 10px 20px; margin-right: 10px; background: green; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ✅ ตรวจแล้ว
                </button>
                <button onclick="updateStatus('${data.id}', 'ไม่ผ่าน')" style="padding: 10px 20px; margin-right: 10px; background: red; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ❌ ไม่ผ่าน
                </button>
                <button onclick="deleteSubmission('${data.id}')" style="padding: 10px 20px; background: gray; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🗑️ ลบ
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

// อัปเดตสถานะ
function updateStatus(docId, newStatus) {
    if (!confirm(`ยืนยันเปลี่ยนสถานะเป็น "${newStatus}"?`)) return;

    db.collection('submits').doc(docId).update({
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('อัปเดตสถานะสำเร็จ!');
        loadSubmissions();
    })
    .catch(err => {
        alert('เกิดข้อผิดพลาด: ' + err.message);
    });
}

// ลบงาน
function deleteSubmission(docId) {
    if (!confirm('ยืนยันลบงานนี้? (ไม่สามารถกู้คืนได้)')) return;

    db.collection('submits').doc(docId).delete()
    .then(() => {
        alert('ลบสำเร็จ!');
        loadSubmissions();
    })
    .catch(err => {
        alert('เกิดข้อผิดพลาด: ' + err.message);
    });
}

// ค้นหา
function filterSubmissions() {
    const searchText = document.getElementById('search-box').value.toLowerCase();
    
    if (searchText === '') {
        renderSubmissions(allSubmissions);
        return;
    }

    const filtered = allSubmissions.filter(data => {
        return (data.name && data.name.toLowerCase().includes(searchText)) ||
               (data.studentId && data.studentId.toLowerCase().includes(searchText)) ||
               (data.subjectName && data.subjectName.toLowerCase().includes(searchText)) ||
               (data.subjectCode && data.subjectCode.toLowerCase().includes(searchText)) ||
               (data.classRoom && data.classRoom.toLowerCase().includes(searchText));
    });

    renderSubmissions(filtered);
}

// อัปเดตสถิติ
function updateStats(total, pending, approved, rejected) {
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-approved').textContent = approved;
    document.getElementById('stat-rejected').textContent = rejected;
}

// เปิด Modal รูป
function openModal(imgSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = 'block';
    modalImg.src = imgSrc;
}

// ปิด Modal
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}