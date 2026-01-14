// Calculator Page JavaScript
function initCalculatorPage() {
    console.log('Initializing Calculator Page...');
    
    // Calculate initial plan
    calculatePlan();
}

let outputText = '';

function formatPlanDate(date, daysToAdd) {
    const result = new Date(date);
    result.setDate(result.getDate() + daysToAdd);
    const day = String(result.getDate()).padStart(2, '0');
    const month = String(result.getMonth() + 1).padStart(2, '0');
    const year = result.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatDateObj(dateObj) {
    const d = new Date(dateObj);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

function calculatePlan() {
    const plotSize = parseFloat(document.getElementById('planPlotSize').value);
    const plotRate = parseFloat(document.getElementById('planPlotRate').value);
    const plcPercent = parseFloat(document.getElementById('planPlcPercent').value) || 0;
    const emiMonths = parseInt(document.getElementById('planEmiMonths').value);
    const today = new Date();

    if (isNaN(plotSize) || isNaN(plotRate)) {
        document.getElementById('paymentPlanPreview').innerHTML = "Please enter valid values.";
        return;
    }

    const baseCost = plotSize * plotRate;
    const plcAmount = baseCost * (plcPercent / 100);
    const totalCost = baseCost + plcAmount;

    let output = `
        <h3>Amount Summary</h3>
        <div class="amountSummary">
        <span><strong>Base Cost:</strong> ₹${baseCost.toFixed(2)}</span><br>
        <span><strong>PLC Amount (${plcPercent}%):</strong> ₹${plcAmount.toFixed(2)}</span><br>
        <span><strong>Total Cost:</strong> ₹${totalCost.toFixed(2)}</span><br>
        </div>
    `;

    outputText = `Base Cost: ₹${baseCost.toFixed(2)}\nPLC Amount (${plcPercent}%): ₹${plcAmount.toFixed(2)}\nTotal Cost: ₹${totalCost.toFixed(2)}\n`;

    // Payment plan: Initial 10% (within 3 days), 20% in second month, remaining 70% divided across chosen plan months
    const p1 = totalCost * 0.10;
    const p2 = totalCost * 0.20;
    const remainingPercent = 70;
    const remainingAmount = totalCost * (remainingPercent / 100);

    // Use full selected months for EMI count (match allotment.js). EMIs start after two months (after the initial 30% is collected).
    let emiCount = parseInt(emiMonths, 10);
    if (isNaN(emiCount) || emiCount < 1) emiCount = 1;
    const emiRaw = remainingAmount / emiCount;
    const emiRounded = Math.round(emiRaw); // show EMI amounts without decimals
    const emiPercentPerInstallment = remainingPercent / emiCount;

    output += `<strong>Payment Plan (${emiMonths} Months):</strong><br>`;
    output += `<div class="initialPayment"> <span>Initial Payment (10%)<br>Due Date ${formatPlanDate(today, 3)}</span><span>₹${p1.toFixed(2)}<br> Initial Payment </span></div>`;
    output += `<div class="initialPayment"> <span>Second Payment (20%)<br>Due Date ${formatPlanDate(today, 28)}</span><span>₹${p2.toFixed(2)} <br> Second Payment </span></div>`;

    output += `<div class="initialPayment"><span><strong>Each EMI:</strong> ${emiPercentPerInstallment.toFixed(1)}% of total (₹${emiRounded})</span></div>`;

    for (let i = 0; i < emiCount; i++) {
        const dateObj = new Date(today);
        dateObj.setMonth(dateObj.getMonth() + i + 2); // EMIs start after 2 months
        const dueDate = formatDateObj(dateObj);
        output += `<div class="monthlyEmi"><span> EMI ${i + 1}: <br> Due Date ${dueDate}</span><span>₹${emiRounded} <br> (${emiPercentPerInstallment.toFixed(1)}% of total)</span></div>`;
    }
    
    // Add to text output
    outputText += `Payment Plan (${emiMonths} Months):\n`;
    outputText += `- ₹${p1.toFixed(2)} by ${formatPlanDate(today, 3)} (10%)\n`;
    outputText += `- ₹${p2.toFixed(2)} by ${formatPlanDate(today, 28)} (20%)\n`;
    outputText += `- Remaining ₹${remainingAmount.toFixed(2)} (${remainingPercent}%) divided in ${emiCount} EMIs of ₹${emiRounded} (${emiPercentPerInstallment.toFixed(1)}% each)\n`;
    
    for (let i = 0; i < emiCount; i++) {
        const dateObj = new Date(today);
        dateObj.setMonth(dateObj.getMonth() + i + 2);
        const dueDate = formatDateObj(dateObj);
        outputText += `- EMI ${i + 1}: ₹${emiRounded} (${emiPercentPerInstallment.toFixed(1)}%) on ${dueDate}\n`;
    }

    document.getElementById('paymentPlanPreview').innerHTML = output;
}

function downloadPlanPDF() {
    try {
        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas library is not loaded. Please try another download method.');
            return;
        }
        
        const element = document.getElementById('paymentPlanPreview');
        
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
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

            pdf.save('payment_plan.pdf');
            showSuccess('calculatorSuccessMessage');
        }).catch(error => {
            alert('Error generating PDF with html2canvas: ' + error.message);
            console.error(error);
        });
    } catch (error) {
        alert('Error generating PDF: ' + error.message);
        console.error(error);
    }
}

function savePlanAsImage() {
    try {
        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas library is not loaded. Please try another download method.');
            return;
        }
        
        const element = document.getElementById('paymentPlanPreview');
        
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'payment_plan.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showSuccess('calculatorSuccessMessage');
        }).catch(error => {
            alert('Error generating image: ' + error.message);
            console.error(error);
        });
    } catch (error) {
        alert('Error generating image: ' + error.message);
        console.error(error);
    }
}