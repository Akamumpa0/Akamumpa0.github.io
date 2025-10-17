// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

mobileToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Smooth scrolling for in-page navigation links and allow page navigation
document.querySelectorAll('.nav-link, .submenu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        // Allow navigation to other pages
        if (targetId === 'home.html' || targetId === 'about.html' || targetId === 'diagnosis.html' || targetId === 'emergency.html' || targetId === 'appointment.html' || targetId === 'healthtrack.html') {
            window.location.href = targetId;
            return;
        }
        // Handle in-page anchor links
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                // Fallback: scroll to top for non-existent anchors
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Health Track functionality (frontend simulation)
document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('history-list');

    // Mock medical history data
    const medicalHistory = [
        {
            date: '2023-10-01',
            description: 'Routine Checkup',
            doctor: 'Dr. John Smith',
            labTest: null // No lab test
        },
        {
            date: '2023-09-15',
            description: 'Blood Test',
            doctor: 'Dr. Jane Doe',
            labTest: 'blood_test_report.pdf' // Lab test available
        },
        {
            date: '2023-08-20',
            description: 'X-Ray',
            doctor: 'Dr. Emily Brown',
            labTest: 'xray_report.pdf' // Lab test available
        },
        {
            date: '2023-07-10',
            description: 'Consultation for Flu',
            doctor: 'Dr. Michael Lee',
            labTest: null // No lab test
        }
    ];

    if (medicalHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No medical history available.</p>';
    } else {
        medicalHistory.forEach(entry => {
            const historyEntry = document.createElement('div');
            historyEntry.classList.add('history-entry');
            historyEntry.innerHTML = `
                <div class="history-info">
                    <h3>${entry.date} - ${entry.description}</h3>
                    <p>Doctor: ${entry.doctor}</p>
                </div>
                ${entry.labTest ? `<button class="download-btn" data-file="${entry.labTest}">Download Lab Test</button>` : ''}
            `;
            historyList.appendChild(historyEntry);
        });

        // Add event listeners to download buttons - generate PDF on the fly
        document.querySelectorAll('.download-btn').forEach(downloadButton => {
            downloadButton.addEventListener('click', () => {
                const labReportFileName = downloadButton.getAttribute('data-file');

                // Derive a friendly title from the file name
                const baseName = labReportFileName.replace(/\.[^/.]+$/, '')
                    .replace(/[_-]+/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());

                // Try to retrieve context from the UI card
                const historyInfo = downloadButton.closest('.history-entry')?.querySelector('.history-info');
                const headingText = historyInfo?.querySelector('h3')?.textContent || '';
                const doctorLine = historyInfo?.querySelector('p')?.textContent || '';

                const generatedAt = new Date();
                const yyyy = generatedAt.getFullYear();
                const mm = String(generatedAt.getMonth() + 1).padStart(2, '0');
                const dd = String(generatedAt.getDate()).padStart(2, '0');
                const hh = String(generatedAt.getHours()).padStart(2, '0');
                const min = String(generatedAt.getMinutes()).padStart(2, '0');

                const fileSafeTitle = baseName.toLowerCase().replace(/\s+/g, '_');
                const pdfFilename = `${fileSafeTitle}_${yyyy}${mm}${dd}_${hh}${min}.pdf`;

                // Build a lightweight HTML document for the PDF
                const container = document.createElement('div');
                container.style.padding = '16px';
                container.style.fontFamily = 'Roboto, Arial, sans-serif';
                container.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
                        <div>
                            <div style="font-size:22px; font-weight:700;">Must Hospital</div>
                            <div style="font-size:12px; color:#666;">Health Track - Lab Test Report</div>
                        </div>
                        <div style="text-align:right; font-size:12px; color:#666;">
                            <div>Generated: ${yyyy}-${mm}-${dd} ${hh}:${min}</div>
                        </div>
                    </div>
                    <hr style="border:none; border-top:1px solid #e5e7eb; margin: 0 0 16px 0;" />
                    <div style="margin-bottom:12px;">
                        <div style="font-size:18px; font-weight:600; margin-bottom:4px;">${baseName}</div>
                        ${headingText ? `<div style="font-size:13px; color:#444;">${headingText}</div>` : ''}
                        ${doctorLine ? `<div style="font-size:13px; color:#444;">${doctorLine}</div>` : ''}
                    </div>
                    <div style="font-size:13px; color:#111; line-height:1.55;">
                        <p style="margin: 0 0 8px 0;">This PDF is a generated copy of your selected lab test record from Health Track.</p>
                        <p style="margin: 0 0 8px 0;">For official use, please verify details at Must Hospital. This document does not replace physician advice.</p>
                    </div>
                `;

                const options = {
                    margin:       10,
                    filename:     pdfFilename,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                if (typeof html2pdf === 'function') {
                    html2pdf().set(options).from(container).save();
                } else {
                    // Fallback in case CDN failed to load
                    alert('PDF generator not available. Please check your internet connection and try again.');
                }
            });
        });
    }
});