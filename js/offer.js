// Offer Page JavaScript
function initOfferPage() {
    console.log('Initializing Offer Page...');

    // Ensure the Date field shows today's date (YYYY-MM-DD)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dateEl = document.getElementById('offerDate');
    if (dateEl) dateEl.value = todayStr; 
}

function generateOfferLetter(event) {
    event.preventDefault && event.preventDefault();

    const date = document.getElementById('offerDate').value;
    const name = document.getElementById('offerName').value;
    const address = document.getElementById('offerAddress').value;
    const mobile = document.getElementById('offerMobile').value;
    const altMobile = document.getElementById('offerAltMobile').value;
    const email = document.getElementById('offerEmail').value;
    const designation = document.getElementById('offerDesignation').value;
    const department = document.getElementById('offerDepartment').value;
    const reporting = document.getElementById('offerReporting').value;
    const apptDate = document.getElementById('offerApptDate').value;
    const location = document.getElementById('offerLocation').value;
    const salary = document.getElementById('offerSalary').value;
    const target = document.getElementById('offerTarget').value;

    const formattedDate = (typeof formatDate === 'function' && date) ? formatDate(new Date(date)) : date;
    const formattedAppt = (typeof formatDate === 'function' && apptDate) ? formatDate(new Date(apptDate)) : (apptDate || '');

    const offerHTML = `
        <div class="company-header offer-header" style="border-bottom: none;">
            <p class="company-offer"> <strong>Offer of Employment</strong></p>
            <div class="logo">
                <img src="image/sviLogo.png" alt="Company Logo" style="max-width: 180px; height: auto;">
            </div>
        
            <div class="adress">
                <p><b>SVI INFRA SOLUTIONS PVT. LTD</b></p>
                <p>A-61 Sector 65 Noida Uttar Pradesh 201309.</p>
            </div>
            
        </div>

        <p><strong>Date: ${formattedDate}</strong></p>

        <div class="address">
            <p class="marbottom"><strong>To,</strong></p>
            <p><strong>Mr. ${name}</strong></p>
            <p>${address}</p>
            <p><strong>Mobile NO :</strong> ${mobile}.</p>
            <p><strong>Alternative NO :</strong> ${altMobile}.</p>
            <p><strong>Email Id :</strong> ${email}</p>
        </div>

        <p class="marbottom"><strong>Subject: Offer of Employment</strong></p>

        <p class="marbottom">Dear <strong>${name}</strong>,</p>

        <p class="marbottom">We are pleased to offer you the position of <strong>${designation}</strong> with <strong>SVI Infra Solutions Pvt. Ltd</strong>, a leading real estate organization known for excellence in property development and customer service. Your skills and experience make you a valuable addition to our team.</p>

        <p class="marbottom">Your appointment will be effective from <strong>${formattedAppt}</strong> under the following terms and conditions:</p>

        
        <p class="marbottom"><strong>Position & Department</strong><br>
            <strong>1.</strong> You will be designated as <strong>${designation}</strong> in the <strong>${department}</strong> Department and will report to ${reporting}.
        </p>
        <p class="marbottom"><strong>Location of Posting</strong><br>
            <strong>2.</strong> Your primary work location will be <strong>${location}</strong>. However, you may be required to travel or relocate as per company requirements.
        </p>
        <p class="marbottom"><strong>Salary & Benefits</strong><br>
            <strong>3.</strong> Your total compensation will be ₹ <strong>${salary} (Target ${target} sq yrd) Per Month</strong>, which includes all statutory benefits as applicable. Additional performance-based incentives will be provided as per company policy.
        </p>
        <p class="marbottom"><strong>Working Hours</strong><br>
                <strong>4.</strong> Your working hours will be from 10:30 am to 6:30 pm, Days of the Week, Wednesday to Monday.
        </p>
        <p class="marbottom"><strong>Probation Period</strong><br>
                <strong>5.</strong> You will be on probation for a period of 3 months. Upon successful completion, your employment may be confirmed in writing.
        </p>
        <p class="marbottom"><strong>Duties & Responsibilities</strong><br>
                <strong>6.</strong> You are expected to perform the duties assigned to you diligently, promote company interests, and maintain professionalism with clients and colleagues.
        </p>
        <p class="marbottom"><strong>Termination</strong><br>
                <strong>7.</strong> Either party may terminate the employment by giving 15 days written notice or salary in lieu thereof.
        </p>
        <p class="marbottom"><strong>Confidentiality</strong><br>
                <strong>8.</strong> You are required to maintain the confidentiality of all company and client information during and after your employment.
        </p>

        <p class="marbottom">We look forward to welcoming you to <strong>SVI Infra Solutions Pvt. Ltd</strong> and working together towards mutual success.</p>

        <p class="marbottom">Please sign and return a copy of this letter as your acceptance of the offer.</p>

        <p class="marbottom"><strong>For SVI Infra Solutions Pvt. Ltd</strong></p>

        <p class="marbottom"><strong>(Authorized Signatory)</strong></p>
        <img src="image/signature-removebg-preview.png" alt="Signature" style="max-width: 150px; height: auto; margin-top: -29px; margin-bottom: -30px;">
        
        <p class="marbottom"><strong>Ilyas Ali</strong><br>( Director )</p>

        <p>Accepted and Signed by:<br>
        Name: __________________<br>
        Signature: __________________<br>
        Date: __________________</p>

    `;

    document.getElementById('offerPreview').innerHTML = offerHTML;
    alert('Offer letter generated. You can download it as PDF or Image.');
}

function downloadOfferPDF() {
    try {
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas library is not loaded. Please try another download method.');
            return;
        }

        const element = document.getElementById('offerPreview');

        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            // Add 50px padding around the captured canvas for PDF output
            const padding = 50; // px
            const paddedCanvas = document.createElement('canvas');
            paddedCanvas.width = canvas.width + padding * 2;
            paddedCanvas.height = canvas.height + padding * 2;
            const ctx = paddedCanvas.getContext('2d');

            // Fill background white and draw the original canvas with offset
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
            ctx.drawImage(canvas, padding, padding);

            const imgData = paddedCanvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = paddedCanvas.height * imgWidth / paddedCanvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('offer_letter.pdf');
            showSuccess('offerSuccessMessage');
        }).catch(error => {
            alert('Error generating PDF with html2canvas: ' + error.message);
            console.error(error);
        });
    } catch (error) {
        alert('Error generating PDF: ' + error.message);
        console.error(error);
    }
}

function saveOfferAsImage() {
    try {
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas library is not loaded. Please try another download method.');
            return;
        }

        const element = document.getElementById('offerPreview');

        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'offer_letter.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showSuccess('offerSuccessMessage');
        }).catch(error => {
            alert('Error generating image: ' + error.message);
            console.error(error);
        });
    } catch (error) {
        alert('Error generating image: ' + error.message);
        console.error(error);
    }
}