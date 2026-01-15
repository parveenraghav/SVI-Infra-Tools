// Allotment Page JavaScript
function initAllotmentPage() {
    console.log('Initializing Allotment Page...');
    
    // Set default booking date to today
    document.getElementById('bookingDate').valueAsDate = new Date();
    
    // Calculate initial total cost
    calculateTotalCost();
}

// Calculate total cost based on area, BSP and PLC
function calculateTotalCost() {
    const area = parseFloat(document.getElementById('area').value) || 0;
    const bsp = parseFloat(document.getElementById('bsp').value) || 0;
    const plc = parseFloat(document.getElementById('plc').value) || 0;
    
    const basicCost = area * bsp;
    const plcAmount = basicCost * (plc / 100);
    const totalCost = basicCost + plcAmount;
    
    document.getElementById('totalCostDisplay').textContent = totalCost.toFixed(2);
    document.getElementById('initialPaymentDisplay').textContent = (totalCost * 0.1).toFixed(2);
}

// Update payment plan details
function updatePaymentPlan() {
    calculateTotalCost();
}

// Generate the allotment letter
function generateAllotment(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const clientName = document.getElementById('clientName').value;
    const address = document.getElementById('address').value;
    const ticketId = document.getElementById('ticketId').value;
    const projectName = document.getElementById('projectName') ? document.getElementById('projectName').value : 'Shyam Aangan';
    const unitNumber = document.getElementById('unitNumber').value;
    const area = document.getElementById('area').value;
    const bsp = document.getElementById('bsp').value;
    const plc = document.getElementById('plc').value;
    const paymentPlanMonths = document.getElementById('paymentPlan').value;
    const advisorName = document.getElementById('advisorName').value;
    const advisorNumber = document.getElementById('advisorNumber').value;
    const bookingDate = new Date(document.getElementById('bookingDate').value);
    
    // Calculate total cost
    const basicCost = parseFloat(area) * parseFloat(bsp);
    const plcAmount = basicCost * (parseFloat(plc) / 100);
    const totalCost = basicCost + (plcAmount || 0);

    // Format date
    const formattedDate = formatDate(new Date());
    
    // Calculate payment amounts
    const initialPayment = (totalCost * 0.1).toFixed(2);
    const secondPayment = (totalCost * 0.2).toFixed(2);
    const remainingPercent = 70; // remaining percent now 70%

    // Determine number of EMIs based on payment plan: use the full selected months
    let numberOfEMIs = parseInt(paymentPlanMonths, 10);
    if (isNaN(numberOfEMIs) || numberOfEMIs < 1) numberOfEMIs = 1;

    // EMI percentage and amount per installment (spread remainingPercent equally)
    const emiPercentage = remainingPercent / numberOfEMIs;
    // Show EMI amount without decimal point (rounded to nearest rupee)
    const emiAmount = Math.round(totalCost * (emiPercentage / 100));

    // Generate EMI dates (EMIs start after 2 months since two upfront payments are due)
    const emiDates = [];
    for (let i = 0; i < numberOfEMIs; i++) {
        const date = new Date(bookingDate);
        date.setMonth(date.getMonth() + i + 2);
        emiDates.push(formatDate(date));
    }

    const finalPaymentDate = emiDates[emiDates.length - 1];
    
    // Create the allotment letter HTML
    const allotmentHTML = `
        <div class="company-header allotment-header">
                <div class="adress">
                    <p class="company-name"><b>SVI INFRA SOLUTIONS PVT. LTD</b></p>
                    <p>Cell: <span>+91 9216014579</span> | Email: <span>info@sviinfrasolutions.com</span></p>
                    <p>Website: <span>www.sviinfrasolutions.in</span> | <span>www.sviinfrasolutions.com</span></p>
                    <p>Office Address : A-61 Sector 65 Noida Uttar Pradesh 201309</p>
                </div>
             <div class="logo">
                    <img src="image/sviLogo.png" alt="Company Logo" style="max-width: 180px; height: auto;">
            </div>
        </div>
        
        <p><strong>Dated: ${formattedDate} </strong></p>
        
        <div class="address">
            <p><strong>To, </strong></p>
            <p><strong>${clientName} </strong></p>
            <p><strong>${address} </strong></p>
        </div>
        
        <p class="marBottom15">Dear Mr./Mrs./Ms. <strong>${clientName} </strong></p>
        
        <p class="marBottom15">Congratulations from Svi Infra Solutions Pvt. Ltd. on your new investment in Shyam
Aangan  (Kishan Garh Renwal, Jaipur, Rajasthan). It is a perfect choice and you are one of the few lucky ones to get unit at such reasonable rates.</p>
        
        <p class="marBottom15">We at Svi Infra Solutions Pvt. Ltd. feel privileged to be part of your great investment. We thank you for giving us an opportunity to assist you in making this very investment. We sincerely hope that you are satisfied with our services and will refer us in your circle.</p>
        
        <p class="marBottom15"><strong>Your Allotment is as Follows:</strong></p>
         
        <p>Ticket Id : <strong>${ticketId}</strong></p>
        <p>Project Name : <strong>${projectName}</strong></p>
        <p class="marBottom15">Unit Number : <strong>${unitNumber}</strong></p>
        
        <p class="marBottom15">Brief details about the total cost of the unit and payment plan are as follows:</p>
         
        <table>
            <tr>
                <th>Client Name</th>
                <th>Allotted Unit</th>
                <th>Area (Sq. Yds.)</th>
                <th>Payment Plan</th>
                <th>BSP (PSq.Yd)</th>
                <th>PLC (in %)</th>
                <th>Total Cost</th>
            </tr>
            <tr>
                <td>${clientName}</td>
                <td>${unitNumber}</td>
                <td>${area}</td>
                <td>${paymentPlanMonths} Months</td>
                <td>${bsp}</td>
                <td>${plc}</td>
                <td>${totalCost.toFixed(2)}</td>
            </tr>
        </table>
        
        <h3>Payment Schedule</h3>
        
        <table>
            <tr>
                <th>SNO</th>
                <th>Date</th>
                <th>Particulars</th>
                <th>%</th>
                <th>Amount</th>
            </tr>
            <tr>
                <td>1</td>
                <td>${formatDate(addDays(bookingDate, 3))}</td>
                <td>On Booking</td>
                <td>10%</td>
                <td>Rs. ${initialPayment}</td>
            </tr>
            <tr>
                <td>2</td>
                <td>${formatDate(addDays(bookingDate, 15))}</td>
                <td>Within 15 days</td>
                <td>20%</td>
                <td>Rs. ${secondPayment}</td>
            </tr>
            ${generateEMIRows(emiDates, emiAmount, numberOfEMIs, emiPercentage)}
        </table>
        <div class="note">
            <p>Please transfer the initial amount of 10% (Rs. ${initialPayment}) by ${formatDate(addDays(bookingDate, 3))} to confirm allotment under ${projectName}, and the second instalment of 20% (Rs. ${secondPayment}) by ${formatDate(addDays(bookingDate, 15))}.</p>
            <p>The remaining 70% will be paid as per the selected payment plan and is scheduled to complete by ${finalPaymentDate}.</p>
            <p>Note: Allotment under ${projectName} will only be confirmed upon receipt of the initial 10% (Rs. ${initialPayment}) by ${formatDate(addDays(bookingDate, 3))}.</p>
            <p>In the event you fail to make the payments as per the payment plan chosen by you, the allotment of these plots will be automatically cancelled.</p>
        </div>

        <p><strong>Payment can be transferred online using the following details:</strong></p>

        <p><strong>Account Name: Svi Infra Solutions Pvt. Ltd </strong></p>
        <p><strong>Account Number: 0894102000013837</strong></p>
        <p><strong>Bank: IDBI BANK </strong></p>
        <p><strong>IFSC CODE: IBKL0000894 </strong></p>

        <p>Your account manager is <strong>${advisorName}</strong> and will be reachable on <strong>${advisorNumber}</strong> for any queries.</p>

        <div class="signature">
            <p>With Best Regards</p>
            
           <p style="margin-top: 0;">For SVI Infra solutions Pvt. Ltd</p>
            <img src="image/signature-removebg-preview.png" alt="Signature" style="max-width: 150px; height: auto; margin-top: -29px; margin-bottom: -30px;">
            <div style="margin-top: 5px; width: 200px; border-top: 1px solid #7f8c8d; margin-right: auto; padding-top: 5px;">
                Director
            </div>
        </div>
    `;
    
    // Display the allotment letter
    document.getElementById('allotmentPreview').innerHTML = allotmentHTML;
    alert("Form validated! Now generating allotment letter...");
    return false;
}

function generateEMIRows(emiDates, emiAmount, numberOfEMIs, emiPercentage) {
    let emiRows = '';
    for (let i = 0; i < numberOfEMIs; i++) {
        const sno = i + 3; // two initial payments exist, so EMIs start at SNO 3
        emiRows += `
            <tr>
                <td>${sno}</td>
                <td>${emiDates[i]}</td>
                        <td>${i + 1} EMI</td>
                <td>${Number(emiPercentage).toFixed(1)}%</td>
                <td>Rs. ${emiAmount}</td>
            </tr>
        `;
    }
    return emiRows;
}

// Download PDF using html2canvas
function downloadWithHtml2Canvas() {
    const element = document.getElementById('allotmentPreview');

    html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {

        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = 210;
        const pageHeight = 297;

        const marginTop = 15;     // applied only after page 1
        const marginBottom = 15;

        const usableHeight = pageHeight - marginTop - marginBottom;

        const imgWidth = pageWidth;

        const pxPageHeight = Math.floor(canvas.width * usableHeight / imgWidth);

        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');

        let renderedHeight = 0;
        let page = 0;

        while (renderedHeight < canvas.height) {

            pageCanvas.width = canvas.width;
            pageCanvas.height = Math.min(pxPageHeight, canvas.height - renderedHeight);

            pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
            pageCtx.drawImage(
                canvas,
                0,
                renderedHeight,
                canvas.width,
                pageCanvas.height,
                0,
                0,
                canvas.width,
                pageCanvas.height
            );

            if (page > 0) pdf.addPage();

            const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);
            const pageImgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;

            // ✅ KEY LINE: remove top padding on first page
            const topPosition = page === 0 ? 0 : marginTop;

            pdf.addImage(
                imgData,
                'JPEG',
                0,
                topPosition,
                imgWidth,
                pageImgHeight
            );

            renderedHeight += pxPageHeight;
            page++;
        }

        pdf.save('allotment_letter.pdf');
    });
}



// Save as image
function saveAllotmentAsImage() {
    try {
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas library is not loaded. Please try another download method.');
            return;
        }
        
        const element = document.getElementById('allotmentPreview');
        
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'allotment_letter.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showSuccess('allotmentSuccessMessage');
        }).catch(error => {
            alert('Error generating image: ' + error.message);
            console.error(error);
        });
    } catch (error) {
        alert('Error generating image: ' + error.message);
        console.error(error);
    }

}



