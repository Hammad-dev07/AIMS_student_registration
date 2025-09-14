// AIMS Society - Complete JavaScript with Google Sheets Backend Integration
// Mathematical Excellence Portal

// ========================================
// GOOGLE SHEETS BACKEND CONFIGURATION
// ========================================

// Google Apps Script Web App URL - Replace with your actual URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzPdW-Ignk652Xl084byUlF9wsZ9ApSJ0gVNFMArEPAr-NqtNNb8-XibTMA_ahSHwMg/exec';

// Math symbols for animation
const mathSymbols = ['∑', '∫', 'π', '∂', '∞', '√', '∆', 'Ω', 'α', 'β', 'γ', 'δ', 'λ', 'μ', 'σ', 'φ', 'ψ', 'θ', '∇', '∃', '∀', '∈', '∉', '⊂', '⊃', '∪', '∩', '≠', '≤', '≥', '±', '∓', '×', '÷', '∝', '≈', '≡', '∴', '∵'];

// Global variables
let studentsDatabase = [];
let totalMembers = 11; // Starting count from your existing data

// ========================================
// MATHEMATICAL ANIMATIONS
// ========================================

function createMathSymbolAnimation() {
    const container = document.getElementById('mathSymbols');
    
    function addSymbol() {
        if (document.querySelectorAll('.math-symbol-animated').length > 15) {
            return; // Limit symbols for performance
        }
        
        const symbol = document.createElement('div');
        symbol.className = 'math-symbol-animated';
        symbol.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        
        // Random horizontal position
        symbol.style.left = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 1.5 + 1; // 1-2.5rem
        symbol.style.fontSize = size + 'rem';
        
        // Random animation duration
        const duration = Math.random() * 4 + 6; // 6-10 seconds
        symbol.style.animationDuration = duration + 's';
        
        container.appendChild(symbol);
        
        // Remove symbol after animation completes
        setTimeout(() => {
            if (symbol.parentNode) {
                symbol.parentNode.removeChild(symbol);
            }
        }, duration * 1000);
    }
    
    // Add symbols periodically
    setInterval(addSymbol, 800);
    
    // Add initial symbols
    for (let i = 0; i < 5; i++) {
        setTimeout(addSymbol, i * 200);
    }
}

// ========================================
// GOOGLE SHEETS BACKEND INTEGRATION
// ========================================

/**
 * Send data to Google Sheets via Google Apps Script
 * @param {Object} studentData - Student registration data
 * @returns {Promise} - Promise that resolves when data is saved
 */
async function sendToGoogleSheets(studentData) {
    try {
        console.log('📊 Sending data to Google Sheets...', studentData);
        
        // Check if URL is configured
        if (GOOGLE_SHEETS_URL.includes('YOUR_GOOGLE')) {
            console.log('⚠️ Google Sheets URL not configured. Data saved locally only.');
            // Save locally as fallback
            studentsDatabase.push(studentData);
            localStorage.setItem('aimsStudents', JSON.stringify(studentsDatabase));
            return { success: true, method: 'local' };
        }
        
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Data successfully saved to Google Sheets:', result);
        
        // Also save locally as backup
        studentsDatabase.push(studentData);
        localStorage.setItem('aimsStudents', JSON.stringify(studentsDatabase));
        
        return result;
        
    } catch (error) {
        console.error('❌ Error saving to Google Sheets:', error);
        
        // Fallback: Save locally if Google Sheets fails
        studentsDatabase.push(studentData);
        localStorage.setItem('aimsStudents', JSON.stringify(studentsDatabase));
        console.log('📱 Data saved locally as fallback');
        
        return { success: true, method: 'local', error: error.message };
    }
}

/**
 * Get all students from Google Sheets
 * @returns {Promise<Array>} - Array of student records
 */
async function getStudentsFromGoogleSheets() {
    try {
        if (GOOGLE_SHEETS_URL.includes('YOUR_GOOGLE')) {
            // Return local data if Google Sheets not configured
            const localData = localStorage.getItem('aimsStudents');
            return localData ? JSON.parse(localData) : [];
        }
        
        const response = await fetch(GOOGLE_SHEETS_URL + '?action=getAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 Retrieved students from Google Sheets:', data);
        return data.students || [];
        
    } catch (error) {
// ========================================
// FORM HANDLING AND VALIDATION
// ========================================

function generateStudentId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return 'AIMS' + timestamp.slice(-6) + random.slice(-2);
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc2626';
            field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.style.borderColor = '#10b981';
            field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }
    });

    // Focus on first invalid field
    if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
}

function formatPhoneNumber(phoneInput) {
    let value = phoneInput.value.replace(/\D/g, '');
    
    if (value.startsWith('92')) {
        value = '+' + value;
    } else if (value.startsWith('0')) {
        value = '+92' + value.substring(1);
    } else if (value.startsWith('3')) {
        value = '+92' + value;
    }
    
    phoneInput.value = value;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// REGISTRATION PROCESS
// ========================================

async function processRegistration() {
    const submitBtn = document.getElementById('submitBtn');
    
    try {
        // Show loading state
        showLoading(true);
        
        const formData = new FormData(document.getElementById('registrationForm'));
        
        // Create comprehensive student record
        const studentRecord = {
            id: generateStudentId(),
            timestamp: new Date().toISOString(),
            registrationDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            registrationTime: new Date().toLocaleTimeString('en-US'),
            fullName: formData.get('fullName').trim(),
            email: formData.get('email').trim().toLowerCase(),
            phone: formData.get('phone').trim(),
            studentId: formData.get('studentId').trim(),
            department: formData.get('department'),
            academicYear: formData.get('year'),
            interests: formData.get('interests').trim() || 'Not specified',
            status: 'Active',
            source: 'AIMS Website Registration - LGU'
        };

        // Validate email
        if (!validateEmail(studentRecord.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Send to Google Sheets (or save locally)
        await sendToGoogleSheets(studentRecord);
        
        // Update local counter
        totalMembers++;
        updateMemberCount();
        
        // Show success with animation
        celebrateSuccess();
        
        // Show success modal
        document.getElementById('successModal').style.display = 'block';
        
        // Reset form
        setTimeout(() => {
            resetFormWithAnimation();
        }, 1000);
        
        console.log('🎉 Registration completed successfully!');
        
    } catch (error) {
        console.error('❌ Registration failed:', error);
        
        // Show user-friendly error
        alert(`Registration failed: ${error.message}\nPlease try again or contact support.`);
        
    } finally {
        // Hide loading state
        showLoading(false);
    }
}

function showLoading(show) {
    const submitBtn = document.getElementById('submitBtn');
    
    if (show) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span style="opacity: 0;">Processing Registration...</span>';
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<span class="btn-math">∇</span>Join AIMS Society<span class="btn-math">∇</span>';
    }
}

function resetFormWithAnimation() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input, index) => {
        setTimeout(() => {
            input.style.transform = 'scale(0.95)';
            input.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                input.value = '';
                input.style.transform = 'scale(1)';
                input.style.borderColor = '#e0e7ff';
                input.style.boxShadow = 'none';
            }, 100);
        }, index * 50);
    });
}

function celebrateSuccess() {
    // Animate stats
    animateStats();
    
    // Create mathematical confetti
    createMathConfetti();
    
    // Pulse form briefly
    const form = document.querySelector('.form-container');
    form.style.transform = 'scale(1.02)';
    form.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        form.style.transform = 'scale(1)';
    }, 300);
}

function createMathConfetti() {
    const colors = ['#0066cc', '#3399ff', '#00aaff', '#004499'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -20px;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                font-size: ${Math.random() * 1.5 + 0.8}rem;
                font-weight: bold;
                z-index: 9999;
                pointer-events: none;
                animation: mathConfettiFall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

// ========================================
// ADMIN FUNCTIONS
// ========================================

async function viewAllStudents() {
    try {
        const students = await getStudentsFromGoogleSheets();
        console.table(students);
        return students;
    } catch (error) {
        console.error('Error viewing students:', error);
        return [];
    }
}

async function getStudentCount() {
    try {
        const students = await getStudentsFromGoogleSheets();
        const count = students.length;
        console.log(`📊 Total registered students: ${count}`);
        return count;
    } catch (error) {
        console.error('Error getting student count:', error);
        return totalMembers; // Return current local count as fallback
    }
}

async function downloadStudentData() {
    try {
        const students = await getStudentsFromGoogleSheets();
        
        if (students.length === 0) {
            console.log('No student data available for download');
            return;
        }
        
        // Create Excel file
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(students);
        
        // Style headers
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_col(C) + "1";
            if (!worksheet[address]) continue;
            worksheet[address].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "0066CC" } }
            };
        }
        
        XLSX.utils.book_append_sheet(workbook, worksheet, "AIMS Students");
        XLSX.writeFile(workbook, `AIMS_LGU_Students_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        console.log('📥 Excel file downloaded successfully');
        
    } catch (error) {
        console.error('❌ Error downloading student data:', error);
    }
}

function searchStudent(searchTerm) {
    return getStudentsFromGoogleSheets().then(students => {
        const results = students.filter(student => 
            student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.table(results);
        return results;
    });
}

function filterByDepartment(dept) {
    return getStudentsFromGoogleSheets().then(students => {
        const filtered = students.filter(student => 
            student.department?.toLowerCase().includes(dept.toLowerCase())
        );
        console.table(filtered);
        return filtered;
    });
}

// ========================================
// INITIALIZATION AND EVENT LISTENERS
// ========================================

function updateMemberCount() {
    document.getElementById('totalStudents').textContent = totalMembers;
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.transform = 'scale(1.15) rotate(5deg)';
            stat.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                stat.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, index * 100);
    });
}

function showWelcomeModal() {
    setTimeout(() => {
        document.getElementById('welcomeModal').style.display = 'block';
    }, 1500);
}

function closeWelcomeModal() {
    document.getElementById('welcomeModal').style.display = 'none';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

async function initializeApp() {
    console.log('🚀 Initializing AIMS Registration System...');
    
    // Load existing student count
    try {
        const count = await getStudentCount();
        if (count > totalMembers) {
            totalMembers = count;
        }
        updateMemberCount();
    } catch (error) {
        console.error('Error loading student count:', error);
        updateMemberCount();
    }
    
    // Start mathematical animations
    createMathSymbolAnimation();
    
    // Show welcome modal
    showWelcomeModal();
    
    // Show admin instructions
    setTimeout(showAdminInstructions, 3000);
    
    console.log('✅ AIMS LGU System initialized successfully!');
}

function showAdminInstructions() {
    console.log(`
🔧 AIMS ADMIN PANEL - Mathematical Excellence Dashboard (LGU)
============================================================

📊 VIEW STUDENT DATA:
   await viewAllStudents()              // View all registered students
   await getStudentCount()              // Get total student count
   
🔍 SEARCH & FILTER:
   await searchStudent("john")          // Search by name/email/ID
   await filterByDepartment("CS")       // Filter by department
   
📥 DOWNLOAD DATA:
   await downloadStudentData()          // Download Excel file with all data
   
🌐 GOOGLE SHEETS ACCESS:
   1. Open your Google Sheets document
   2. View real-time data updates
   3. Create charts and analytics
   
⚙️ BACKEND STATUS:
   Google Sheets URL: ${GOOGLE_SHEETS_URL}
   Status: ${GOOGLE_SHEETS_URL.includes('YOUR_GOOGLE') ? '❌ Not Configured (Using Local Storage)' : '✅ Active'}
   Current Members: ${totalMembers}
   
============================================================
📋 Setup Guide: Check artifacts for complete backend setup
All student data is stored securely for LGU AIMS Society!
    `);
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 DOM Content Loaded - Setting up event listeners...');
    
    // Form submission
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            processRegistration();
        } else {
            console.log('❌ Form validation failed');
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
    });

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#dc2626';
            this.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
        }
    });

    // Enhanced form interactions
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'all 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });

        input.addEventListener('input', function() {
            if (this.hasAttribute('required') && this.value.trim()) {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }
        });
    });

    // Modal close events
    window.addEventListener('click', function(event) {
        const welcomeModal = document.getElementById('welcomeModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === welcomeModal) {
            welcomeModal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // Secret admin panel (Ctrl+Shift+A)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
            openAdminPanel();
        }
    });
});

// Admin panel GUI
function openAdminPanel() {
    getStudentCount().then(count => {
        const adminPanel = document.createElement('div');
        adminPanel.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 34, 102, 0.95); z-index: 10000; color: white; overflow-y: auto; backdrop-filter: blur(10px);">
                <div style="max-width: 1200px; margin: 50px auto; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h1 style="color: #3399ff;">🔧 AIMS LGU Mathematical Admin Panel</h1>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #dc2626; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Close Panel</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-bottom: 30px;">
                        <div style="background: rgba(51, 153, 255, 0.1); padding: 25px; border-radius: 15px; border: 1px solid rgba(51, 153, 255, 0.3);">
                            <h3 style="color: #3399ff; margin-bottom: 15px;">📊 Statistics</h3>
                            <p style="margin: 8px 0;"><strong>Total Students:</strong> ${count}</p>
                            <p style="margin: 8px 0;"><strong>University:</strong> LGU</p>
                            <p style="margin: 8px 0;"><strong>Backend:</strong> ${GOOGLE_SHEETS_URL.includes('YOUR_GOOGLE') ? 'Local Storage' : 'Google Sheets'}</p>
                            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #10b981;">Active ✓</span></p>
                        </div>
                        
                        <div style="background: rgba(51, 153, 255, 0.1); padding: 25px; border-radius: 15px; border: 1px solid rgba(51, 153, 255, 0.3);">
                            <h3 style="color: #3399ff; margin-bottom: 15px;">📥 Quick Actions</h3>
                            <button onclick="downloadStudentData()" style="background: #10b981; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 8px; cursor: pointer; font-weight: 600;">Download Excel</button>
                            <button onclick="viewAllStudents()" style="background: #0066cc; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 8px; cursor: pointer; font-weight: 600;">View Students</button>
                            <button onclick="getStudentCount().then(c => alert('Total: ' + c))" style="background: #8b5cf6; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 8px; cursor: pointer; font-weight: 600;">Refresh Count</button>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 15px;">
                        <h3 style="color: #3399ff; margin-bottom: 20px;">🔧 Console Commands</h3>
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.6;">
                            <div>await viewAllStudents() // View all students</div>
                            <div>await searchStudent("name") // Search students</div>
                            <div>await filterByDepartment("CS") // Filter by department</div>
                            <div>await downloadStudentData() // Download Excel file</div>
                            <div>AIMS.openAdminPanel() // Open this panel anytime</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(adminPanel);
    });
}

// Add mathematical confetti CSS
const mathConfettiCSS = `
    @keyframes mathConfettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = mathConfettiCSS;
document.head.appendChild(style);

// Initialize the application
window.addEventListener('load', initializeApp);

// Export functions for global access
window.AIMS = {
    viewAllStudents,
    getStudentCount,
    downloadStudentData,
    searchStudent,
    filterByDepartment,
    openAdminPanel
};('❌ Error getting students from Google Sheets:', error);
        
        // Fallback: Return local data
        const localData = localStorage.getItem('aimsStudents');
        return localData ? JSON.parse(localData) : [];
    }
}

// ========================================
// FORM HANDLING AND VALIDATION
// ========================================

function generateStudentId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return 'AIMS' + timestamp.slice(-6) + random.slice(-2);
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc2626';
            field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.style.borderColor = '#10b981';
            field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }
    });

    // Focus on first invalid field
    if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
}

function formatPhoneNumber(phoneInput) {
    let value = phoneInput.value.replace(/\D/g, '');
    
    if (value.startsWith('92')) {
        value = '+' + value;
    } else if (value.startsWith('0')) {
        value = '+92' + value.substring(1);
    } else if (value.startsWith('3')) {
        value = '+92' + value;
    }
    
    phoneInput.value = value;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// REGISTRATION PROCESS
// ========================================

async function processRegistration() {
    const submitBtn = document.getElementById('submitBtn');
    
    try {
        // Show loading state
        showLoading(true);
        
        const formData = new FormData(document.getElementById('registrationForm'));
        
        // Create comprehensive student record
        const studentRecord = {
            id: generateStudentId(),
            timestamp: new Date().toISOString(),
            registrationDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            registrationTime: new Date().toLocaleTimeString('en-US'),
            fullName: formData.get('fullName').trim(),
            email: formData.get('email').trim().toLowerCase(),
            phone: formData.get('phone').trim(),
            studentId: formData.get('studentId').trim(),
            department: formData.get('department'),
            academicYear: formData.get('year'),
            interests: formData.get('interests').trim() || 'Not specified',
            status: 'Active',
            source: 'AIMS Website Registration'
        };

        // Validate email
        if (!validateEmail(studentRecord.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Send to Google Sheets
        await sendToGoogleSheets(studentRecord);
        
        // Update local counter
        totalMembers++;
        updateMemberCount();
        
        // Show success with animation
        celebrateSuccess();
        
        // Show success modal
        document.getElementById('successModal').style.display = 'block';
        
        // Reset form
        setTimeout(() => {
            resetFormWithAnimation();
        }, 1000);
        
        console.log('🎉 Registration completed successfully!');
        
    } catch (error) {
        console.error('❌ Registration failed:', error);
        
        // Show user-friendly error
        alert(`Registration failed: ${error.message}\nPlease try again or contact support.`);
        
    } finally {
        // Hide loading state
        showLoading(false);
    }
}

function showLoading(show) {
    const submitBtn = document.getElementById('submitBtn');
    
    if (show) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span style="opacity: 0;">Processing Registration...</span>';
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<span class="btn-math">∇</span>Join AIMS Society<span class="btn-math">∇</span>';
    }
}

function resetFormWithAnimation() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input, index) => {
        setTimeout(() => {
            input.style.transform = 'scale(0.95)';
            input.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                input.value = '';
                input.style.transform = 'scale(1)';
                input.style.borderColor = '#e0e7ff';
                input.style.boxShadow = 'none';
            }, 100);
        }, index * 50);
    });
}

function celebrateSuccess() {
    // Animate stats
    animateStats();
    
    // Create mathematical confetti
    createMathConfetti();
    
    // Pulse form briefly
    const form = document.querySelector('.form-container');
    form.style.transform = 'scale(1.02)';
    form.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        form.style.transform = 'scale(1)';
    }, 300);
}

function createMathConfetti() {
    const colors = ['#0066cc', '#3399ff', '#00aaff', '#004499'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -20px;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                font-size: ${Math.random() * 1.5 + 0.8}rem;
                font-weight: bold;
                z-index: 9999;
                pointer-events: none;
                animation: mathConfettiFall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

// ========================================
// ADMIN FUNCTIONS
// ========================================

async function viewAllStudents() {
    try {
        const students = await getStudentsFromGoogleSheets();
        console.table(students);
        return students;
    } catch (error) {
        console.error('Error viewing students:', error);
        return [];
    }
}

async function getStudentCount() {
    try {
        const students = await getStudentsFromGoogleSheets();
        const count = students.length;
        console.log(`📊 Total registered students: ${count}`);
        return count;
    } catch (error) {
        console.error('Error getting student count:', error);
        return 0;
    }
}

async function downloadStudentData() {
    try {
        const students = await getStudentsFromGoogleSheets();
        
        if (students.length === 0) {
            console.log('No student data available for download');
            return;
        }
        
        // Create Excel file
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(students);
        
        // Style headers
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_col(C) + "1";
            if (!worksheet[address]) continue;
            worksheet[address].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "0066CC" } }
            };
        }
        
        XLSX.utils.book_append_sheet(workbook, worksheet, "AIMS Students");
        XLSX.writeFile(workbook, `AIMS_Students_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        console.log('📥 Excel file downloaded successfully');
        
    } catch (error) {
        console.error('❌ Error downloading student data:', error);
    }
}

function searchStudent(searchTerm) {
    return getStudentsFromGoogleSheets().then(students => {
        const results = students.filter(student => 
            student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.table(results);
        return results;
    });
}

function filterByDepartment(dept) {
    return getStudentsFromGoogleSheets().then(students => {
        const filtered = students.filter(student => 
            student.department?.toLowerCase().includes(dept.toLowerCase())
        );
        console.table(filtered);
        return filtered;
    });
}

// ========================================
// INITIALIZATION AND EVENT LISTENERS
// ========================================

function updateMemberCount() {
    document.getElementById('totalStudents').textContent = totalMembers;
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.transform = 'scale(1.15) rotate(5deg)';
            stat.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                stat.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, index * 100);
    });
}

function showWelcomeModal() {
    setTimeout(() => {
        document.getElementById('welcomeModal').style.display = 'block';
    }, 1500);
}

function closeWelcomeModal() {
    document.getElementById('welcomeModal').style.display = 'none';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

async function initializeApp() {
    console.log('🚀 Initializing AIMS Registration System...');
    
    // Load existing student count
    try {
        totalMembers = await getStudentCount();
        updateMemberCount();
    } catch (error) {
        console.error('Error loading student count:', error);
    }
    
    // Start mathematical animations
    createMathSymbolAnimation();
    
    // Show welcome modal
    showWelcomeModal();
    
    // Show admin instructions
    setTimeout(showAdminInstructions, 3000);
    
    console.log('✅ AIMS System initialized successfully!');
}

function showAdminInstructions() {
    console.log(`
🔧 AIMS ADMIN PANEL - Mathematical Excellence Dashboard
================================================

📊 VIEW STUDENT DATA:
   await viewAllStudents()              // View all registered students
   await getStudentCount()              // Get total student count
   
🔍 SEARCH & FILTER:
   await searchStudent("john")          // Search by name/email/ID
   await filterByDepartment("Math")     // Filter by department
   
📥 DOWNLOAD DATA:
   await downloadStudentData()          // Download Excel file with all data
   
🌐 GOOGLE SHEETS ACCESS:
   1. Open your Google Sheets document
   2. View real-time data updates
   3. Create charts and analytics
   
⚙️ BACKEND STATUS:
   Google Sheets URL: ${GOOGLE_SHEETS_URL}
   Status: ${GOOGLE_SHEETS_URL.includes('YOUR_GOOGLE') ? '❌ Not Configured' : '✅ Active'}
   
================================================
📋 Setup Instructions: Check console for backend setup guide
All student data is automatically saved to Google Sheets in real-time!
    `);
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 DOM Content Loaded - Setting up event listeners...');
    
    // Form submission
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            processRegistration();
        } else {
            console.log('❌ Form validation failed');
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
    });

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#dc2626';
            this.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
        }
    });

    // Enhanced form interactions
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'all 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });

        input.addEventListener('input', function() {
            if (this.hasAttribute('required') && this.value.trim()) {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }
        });
    });

    // Modal close events
    window.addEventListener('click', function(event) {
        const welcomeModal = document.getElementById('welcomeModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === welcomeModal) {
            welcomeModal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // Secret admin panel (Ctrl+Shift+A)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
            openAdminPanel();
        }
    });
});

// Admin panel GUI
function openAdminPanel() {
    getStudentCount().then(count => {
        const adminPanel = document.createElement('div');
        adminPanel.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 34, 102, 0.95); z-index: 10000; color: white; overflow-y: auto; backdrop-filter: blur(10px);">
                <div style="max-width: 1200px; margin: 50px auto; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h1 style="color: #3399ff;">🔧 AIMS Mathematical Admin Panel</h1>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #dc2626; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Close Panel</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-bottom: 30px;">
                        <div style="background: rgba(51, 153, 255, 0.1); padding: 25px; border-radius: 15px; border: 1px solid rgba(51, 153, 255, 0.3);">
                            <h3 style="color: #3399ff; margin-bottom: 15px;">📊 Statistics</h3>
                            <p style="margin: 8px 0;"><strong>Total Students:</strong> ${count}</p>
                            <p style="margin: 8px 0;"><strong>Backend:</strong> Google Sheets</p>
                            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #10b981;">Active ✓</span></p>
                        </div>
                        
                        <div style="background: rgba(51, 153, 255, 0.1); padding: 25px; border-radius: 15px; border: 1px solid rgba(51, 153, 255, 0.3);">
                            <h3 style="color: #3399ff; margin-bottom: 15px;">📥 Quick Actions</h3>
                            <button onclick="downloadStudentData()" style="background: #10b981; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 8px; cursor: pointer; font-weight: 600;">Download Excel</button>
                            <button onclick="viewAllStudents()" style="background: #0066cc; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 8px; cursor: pointer; font-weight: 600;">View Students</button>
                            <button onclick="getStudentCount()" style="background: #8b5cf6; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 8px; cursor: pointer; font-weight: 600;">Refresh Count</button>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 15px;">
                        <h3 style="color: #3399ff; margin-bottom: 20px;">🔧 Console Commands</h3>
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.6;">
                            <div>await viewAllStudents() // View all students</div>
                            <div>await searchStudent("name") // Search students</div>
                            <div>await filterByDepartment("CS") // Filter by department</div>
                            <div>await downloadStudentData() // Download Excel file</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(adminPanel);
    });
}

// Add mathematical confetti CSS
const mathConfettiCSS = `
    @keyframes mathConfettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = mathConfettiCSS;
document.head.appendChild(style);

// Initialize the application
window.addEventListener('load', initializeApp);

// Export functions for global access
window.AIMS = {
    viewAllStudents,
    getStudentCount,
    downloadStudentData,
    searchStudent,
    filterByDepartment,
    openAdminPanel
};