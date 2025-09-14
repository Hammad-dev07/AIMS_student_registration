// AIMS Student Registration Portal - JavaScript
// Artificial Intelligence & Mathematics Society - LGU

// Configuration
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwyDEsuMy461OCbttAkA1l3Vy5zKziYxsfcVGY1mPdjUWYPr1W5smXTouvxFG15I5Db/exec';

// Global Variables
let studentsDatabase = [];
let totalMembers = 11;

// Math symbols for animation
const mathSymbols = ['∑', '∫', 'π', '∂', '∞', '√', '∆', 'Ω', 'α', 'β', 'γ', 'δ', 'λ', 'μ', 'σ', 'φ', 'ψ', 'θ', '∇', '∃', '∀', '∈', '∉', '⊂', '⊃', '∪', '∩', '≠', '≤', '≥', '±', '∓', '×', '÷', '∝', '≈', '≡', '∴', '∵'];

// ====================================
// MATHEMATICAL ANIMATIONS
// ====================================

function createMathSymbolAnimation() {
    const container = document.getElementById('mathSymbols');
    if (!container) return;
    
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
    const symbolInterval = setInterval(addSymbol, 800);
    
    // Add initial symbols
    for (let i = 0; i < 5; i++) {
        setTimeout(addSymbol, i * 200);
    }
    
    // Store interval for cleanup
    window.mathSymbolInterval = symbolInterval;
}

// ====================================
// MODAL FUNCTIONS
// ====================================

function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'block';
        console.log('Welcome modal shown');
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('Welcome modal closed');
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        console.log('Success modal shown');
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('Success modal closed');
    }
}

// ====================================
// GOOGLE SHEETS INTEGRATION
// ====================================

async function sendToGoogleSheets(studentData) {
    console.log('📊 Sending data to Google Sheets...', studentData);

    const formBody = Object.keys(studentData)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(studentData[key]))
        .join('&');

    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            throw new Error('Invalid JSON response from server');
        }

        console.log('✅ Success:', result);

        // Save locally as backup
        studentsDatabase.push(studentData);
        localStorage.setItem('aimsStudents', JSON.stringify(studentsDatabase));

        return result;

    } catch (error) {
        console.error('❌ Google Sheets Error:', error);

        // Save locally as fallback
        studentsDatabase.push(studentData);
        localStorage.setItem('aimsStudents', JSON.stringify(studentsDatabase));

        // Show user-friendly error
        alert(`Backend Error: ${error.message}\nYour data has been saved locally as backup.`);
        return { success: false, error: error.message };
    }
}

// ====================================
// FORM HANDLING & VALIDATION
// ====================================

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

// ====================================
// REGISTRATION PROCESS
// ====================================

async function processRegistration() {
    try {
        showLoading(true);
        
        const formData = new FormData(document.getElementById('registrationForm'));
        
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

        // Validate email format
        if (!validateEmail(studentRecord.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Send to Google Sheets
        await sendToGoogleSheets(studentRecord);
        
        // Update member count
        totalMembers++;
        updateMemberCount();
        
        // Show success animation
        celebrateSuccess();
        
        // Show success modal
        showSuccessModal();
        
        // Reset form after delay
        setTimeout(() => {
            resetForm();
        }, 1000);
        
        console.log('🎉 Registration completed successfully!');
        
    } catch (error) {
        console.error('❌ Registration failed:', error);
        alert(`Registration failed: ${error.message}\nPlease try again.`);
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    const submitBtn = document.getElementById('submitBtn');
    
    if (show) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

function resetForm() {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.reset();
        
        // Reset field styles
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#e0e7ff';
            input.style.boxShadow = 'none';
        });
    }
}

function celebrateSuccess() {
    // Animate stats
    animateStats();
    
    // Create mathematical confetti
    createMathConfetti();
    
    // Pulse form briefly
    const form = document.querySelector('.form-container');
    if (form) {
        form.style.transform = 'scale(1.02)';
        form.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            form.style.transform = 'scale(1)';
        }, 300);
    }
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

function updateMemberCount() {
    const memberElement = document.getElementById('totalStudents');
    if (memberElement) {
        memberElement.textContent = totalMembers;
        
        // Animate counter
        memberElement.style.transform = 'scale(1.2)';
        memberElement.style.color = '#10b981';
        
        setTimeout(() => {
            memberElement.style.transform = 'scale(1)';
            memberElement.style.color = '#00aaff';
        }, 500);
    }
}

// ====================================
// ADMIN FUNCTIONS
// ====================================

async function viewAllStudents() {
    try {
        const localData = localStorage.getItem('aimsStudents');
        const students = localData ? JSON.parse(localData) : [];
        console.table(students);
        console.log(`📊 Total Students: ${students.length}`);
        return students;
    } catch (error) {
        console.error('Error viewing students:', error);
        return [];
    }
}

async function downloadStudentData() {
    try {
        const localData = localStorage.getItem('aimsStudents');
        const students = localData ? JSON.parse(localData) : [];
        
        if (students.length === 0) {
            console.log('⚠️ No student data available for download');
            alert('No student data available for download');
            return;
        }
        
        // Create Excel file using XLSX library
        if (typeof XLSX !== 'undefined') {
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
        } else {
            console.error('XLSX library not loaded');
            alert('Excel library not available. Please refresh the page and try again.');
        }
        
    } catch (error) {
        console.error('❌ Error downloading student data:', error);
        alert('Error downloading data. Please try again.');
    }
}

function getStudentCount() {
    const localData = localStorage.getItem('aimsStudents');
    const students = localData ? JSON.parse(localData) : [];
    const count = students.length;
    console.log(`📊 Total registered students: ${count}`);
    return count;
}

// ====================================
// EVENT LISTENERS & INITIALIZATION
// ====================================

function initializeApp() {
    console.log('Initializing AIMS LGU Registration System...');
    
    // Load existing data
    const savedData = localStorage.getItem('aimsStudents');
    if (savedData) {
        try {
            studentsDatabase = JSON.parse(savedData);
            totalMembers = Math.max(totalMembers, studentsDatabase.length);
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
    
    // Update member count
    updateMemberCount();
    
    // Start mathematical animations
    createMathSymbolAnimation();
    
    // Force show welcome modal (debugging)
    console.log('Forcing welcome modal to show...');
    setTimeout(() => {
        const modal = document.getElementById('welcomeModal');
        console.log('Modal element found:', !!modal);
        if (modal) {
            modal.style.display = 'block';
            modal.style.zIndex = '10000';
            console.log('Welcome modal should be visible now');
        }
    }, 1000);
    
    // Show admin instructions in console
    setTimeout(showAdminInstructions, 3000);
    
    console.log('AIMS System initialized successfully!');
}

function showAdminInstructions() {
    console.log(`
🔧 AIMS ADMIN PANEL - LGU Mathematical Excellence Dashboard
=========================================================

📊 VIEW STUDENT DATA:
   viewAllStudents()              // View all registered students
   getStudentCount()              // Get total student count
   
📥 DOWNLOAD DATA:
   downloadStudentData()          // Download Excel file with all data
   
🔧 DEBUG FUNCTIONS:
   AIMS_DEBUG.showWelcome()       // Show welcome modal
   AIMS_DEBUG.showSuccess()       // Show success modal
   AIMS_DEBUG.testBackend()       // Test Google Sheets connection
   AIMS_DEBUG.checkData()         // Check local data
   
⚙️ BACKEND STATUS:
   Google Sheets URL: ${GOOGLE_SHEETS_URL}
   Status: ✅ Active
   Current Members: ${totalMembers}
   Local Storage: ${localStorage.getItem('aimsStudents') ? 'Available' : 'Empty'}
   
=========================================================
All student data is stored both in Google Sheets and locally!
AIMS LGU - Artificial Intelligence & Mathematics Society
    `);
}

// Set up event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 DOM Content Loaded - Setting up event listeners...');
    
    // Form submission handler
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                processRegistration();
            } else {
                console.log('❌ Form validation failed');
            }
        });
    }

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#dc2626';
                this.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            }
        });
    }

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

    // Modal click outside to close
    window.addEventListener('click', function(event) {
        const welcomeModal = document.getElementById('welcomeModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === welcomeModal) {
            closeWelcomeModal();
        }
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });

    // Secret admin panel hotkey (Ctrl+Shift+A)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
            openAdminPanel();
        }
    });
});

// Admin GUI Panel
function openAdminPanel() {
    const count = getStudentCount();
    const adminPanel = document.createElement('div');
    adminPanel.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 34, 102, 0.95); z-index: 10000; color: white; overflow-y: auto; backdrop-filter: blur(10px);">
            <div style="max-width: 1200px; margin: 50px auto; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h1 style="color: #3399ff;">🔧 AIMS LGU Admin Panel</h1>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #dc2626; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Close Panel</button>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 15px;">
                    <h3 style="color: #3399ff; margin-bottom: 20px;">🔧 Console Commands</h3>
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.6;">
                        <div>viewAllStudents() // View all students</div>
                        <div>downloadStudentData() // Download Excel file</div>
                        <div>getStudentCount() // Get total count</div>
                        <div>AIMS_DEBUG.testBackend() // Test Google Sheets</div>
                        <div>openAdminPanel() // Open this panel</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(adminPanel);
}

// Add mathematical confetti CSS animation
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

// Inject CSS for confetti animation
const style = document.createElement('style');
style.textContent = mathConfettiCSS;
document.head.appendChild(style);

// Initialize the application when page loads
window.addEventListener('load', initializeApp);

// ====================================
// GLOBAL DEBUG & ADMIN INTERFACE
// ====================================

// Debug functions for testing
window.AIMS_DEBUG = {
    showWelcome: showWelcomeModal,
    showSuccess: showSuccessModal,
    closeWelcome: closeWelcomeModal,
    closeSuccess: closeSuccessModal,
    testBackend: () => {
        const testData = {
            test: true, 
            timestamp: new Date().toISOString(),
            message: 'Test connection to Google Sheets'
        };
        return sendToGoogleSheets(testData);
    },
    checkData: () => {
        const data = localStorage.getItem('aimsStudents');
        console.log('Local Storage Data:', data ? JSON.parse(data) : 'No data found');
        return data ? JSON.parse(data) : [];
    },
    clearData: () => {
        if (confirm('Are you sure you want to clear all local data?')) {
            localStorage.removeItem('aimsStudents');
            studentsDatabase = [];
            totalMembers = 11; // Reset to initial count
            updateMemberCount();
            console.log('Local data cleared');
        }
    },
    exportJSON: () => {
        const data = localStorage.getItem('aimsStudents');
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aims_students_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('JSON data exported');
        } else {
            console.log('No data to export');
        }
    }
};

// Global admin functions
window.viewAllStudents = viewAllStudents;
window.downloadStudentData = downloadStudentData;
window.getStudentCount = getStudentCount;
window.openAdminPanel = openAdminPanel;

// Cleanup function for page unload
window.addEventListener('beforeunload', function() {
    if (window.mathSymbolInterval) {
        clearInterval(window.mathSymbolInterval);
    }
});

// Error handling for uncaught errors
window.addEventListener('error', function(event) {
    console.error('AIMS System Error:', event.error);
});

// Optional: Simple console message (can be removed)
// console.log('AIMS Registration System - Ready');