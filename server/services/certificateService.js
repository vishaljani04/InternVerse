const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure certificates directory exists
const certDir = path.join(__dirname, '..', 'certificates');
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
}

const generateCertificatePDF = async (data) => {
    const {
        certificateId,
        internName,
        internshipRole,
        department,
        startDate,
        endDate,
        performanceRating,
        companyName = 'InternVerse Technologies'
    } = data;

    const filename = `certificate_${certificateId}.pdf`;
    const filePath = path.join(certDir, filename);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margins: { top: 40, bottom: 40, left: 50, right: 50 }
        });

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        const width = doc.page.width;
        const height = doc.page.height;

        // Background gradient effect
        doc.rect(0, 0, width, height).fill('#fefefe');

        // Decorative border
        doc.lineWidth(3)
            .rect(20, 20, width - 40, height - 40)
            .stroke('#6366f1');

        doc.lineWidth(1)
            .rect(28, 28, width - 56, height - 56)
            .stroke('#a5b4fc');

        // Corner decorations
        const corners = [
            { x: 35, y: 35 }, { x: width - 55, y: 35 },
            { x: 35, y: height - 55 }, { x: width - 55, y: height - 55 }
        ];
        corners.forEach(c => {
            doc.circle(c.x, c.y, 6).fill('#6366f1');
        });

        // Top decorative line
        doc.moveTo(50, 65).lineTo(width - 50, 65).lineWidth(2).stroke('#e0e7ff');

        // Company name
        doc.fontSize(14)
            .fillColor('#6366f1')
            .font('Helvetica-Bold')
            .text(companyName, 0, 80, { align: 'center' });

        // Title
        doc.fontSize(36)
            .fillColor('#1e1b4b')
            .font('Helvetica-Bold')
            .text('CERTIFICATE', 0, 110, { align: 'center' });

        doc.fontSize(18)
            .fillColor('#4338ca')
            .font('Helvetica')
            .text('OF INTERNSHIP COMPLETION', 0, 155, { align: 'center' });

        // Decorative divider
        doc.moveTo(width / 2 - 80, 185).lineTo(width / 2 + 80, 185).lineWidth(2).stroke('#6366f1');

        // Presented to
        doc.fontSize(12)
            .fillColor('#64748b')
            .font('Helvetica')
            .text('This certificate is proudly presented to', 0, 200, { align: 'center' });

        // Intern name
        doc.fontSize(32)
            .fillColor('#1e293b')
            .font('Helvetica-Bold')
            .text(internName, 0, 225, { align: 'center' });

        // Underline for name
        const nameWidth = doc.widthOfString(internName);
        const nameX = (width - nameWidth) / 2;
        doc.moveTo(nameX, 265).lineTo(nameX + nameWidth, 265).lineWidth(1).stroke('#a5b4fc');

        // Details
        doc.fontSize(12)
            .fillColor('#475569')
            .font('Helvetica')
            .text(`For successfully completing the internship program as`, 0, 285, { align: 'center' });

        doc.fontSize(16)
            .fillColor('#4338ca')
            .font('Helvetica-Bold')
            .text(`${internshipRole} — ${department}`, 0, 308, { align: 'center' });

        // Duration
        const startStr = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const endStr = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        doc.fontSize(11)
            .fillColor('#64748b')
            .font('Helvetica')
            .text(`Duration: ${startStr} — ${endStr}`, 0, 340, { align: 'center' });

        // Performance rating
        if (performanceRating) {
            const ratingText = `Performance Rating: ${performanceRating}/10`;
            const stars = '★'.repeat(Math.round(performanceRating / 2)) + '☆'.repeat(5 - Math.round(performanceRating / 2));
            doc.fontSize(11).fillColor('#f59e0b').font('Helvetica-Bold')
                .text(`${stars}  ${ratingText}`, 0, 365, { align: 'center' });
        }

        // Bottom decorative line
        doc.moveTo(50, height - 130).lineTo(width - 50, height - 130).lineWidth(1).stroke('#e0e7ff');

        // Signature area
        const sigY = height - 115;

        // Left signature
        doc.moveTo(120, sigY + 30).lineTo(300, sigY + 30).lineWidth(1).stroke('#94a3b8');
        doc.fontSize(10).fillColor('#64748b').font('Helvetica')
            .text('Authorized Signature', 140, sigY + 35);
        doc.fontSize(10).fillColor('#334155').font('Helvetica-Bold')
            .text('Program Director', 155, sigY + 50);

        // Right - Certificate ID
        doc.moveTo(width - 300, sigY + 30).lineTo(width - 120, sigY + 30).lineWidth(1).stroke('#94a3b8');
        doc.fontSize(10).fillColor('#64748b').font('Helvetica')
            .text(`Certificate ID: ${certificateId}`, width - 290, sigY + 35);
        doc.fontSize(10).fillColor('#334155').font('Helvetica-Bold')
            .text(`Issued: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, width - 275, sigY + 50);

        doc.end();

        writeStream.on('finish', () => {
            resolve({ filename, filePath: `/certificates/${filename}` });
        });

        writeStream.on('error', reject);
    });
};

module.exports = { generateCertificatePDF };
