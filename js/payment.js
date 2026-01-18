// Payment Page JavaScript
function initPaymentPage() {
    console.log('Initializing Payment Page...');
    
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();

    // Prefill Receipt Number from last saved value (+1) if the field is empty
    const receiptEl = document.getElementById('receiptNo');
    if (receiptEl && (!receiptEl.value || receiptEl.value.trim() === '')) {
        const lastReceipt = parseInt(localStorage.getItem('lastReceiptNo'), 10);
        if (!isNaN(lastReceipt)) {
            receiptEl.value = String(lastReceipt + 1);
        }
    }

    // Attach submit handler to form (idempotent)
    const form = document.getElementById('receiptForm');
    if (form && !form.dataset.hasSubmitListener) {
        form.addEventListener('submit', function(e) {
            // If form is invalid, show native browser messages and do nothing
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Prevent actual form submission and update preview
            e.preventDefault();
            generateReceipt();
        });
        form.dataset.hasSubmitListener = 'true';
    }

    // Attach amount -> words listener (idempotent)
    const amountInput = document.getElementById('amount');
    if (amountInput && !amountInput.dataset.hasWordsListener) {
        amountInput.addEventListener('input', function() {
            const words = numberToWords(this.value);
            let wordsText = words ? words.trim() : '';
            // Append 'Only' if not already present
            if (wordsText && !/only$/i.test(wordsText)) {
                wordsText = wordsText + ' Only';
            }
            const amountWordsInput = document.getElementById('amountWords');
            if (amountWordsInput) amountWordsInput.value = wordsText;
            const previewWords = document.getElementById('previewAmountWords');
            if (previewWords) previewWords.textContent = wordsText;
        });
        amountInput.dataset.hasWordsListener = 'true';
        // initialize if value present
        if (amountInput.value) {
            amountInput.dispatchEvent(new Event('input'));
        }
    }

    // Attach plot size listener to update preview live
    const plotSizeInput = document.getElementById('plotSize');
    if (plotSizeInput && !plotSizeInput.dataset.hasPlotSizeListener) {
        plotSizeInput.addEventListener('input', function() {
            let v = this.value ? this.value.trim() : '';
            if (v && !/\(|sq\.? *yrd/i.test(v)) {
                v = `${v} (Sq.Yrd)`;
            }
            const previewPlot = document.getElementById('plotSizechange');
            if (previewPlot) previewPlot.textContent = v;
        });
        plotSizeInput.dataset.hasPlotSizeListener = 'true';
        if (plotSizeInput.value) plotSizeInput.dispatchEvent(new Event('input'));
    }
}

// Format the date for display
function formatDateReceipt(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}-${month}-${year}`;
}

// Convert a number to words (Indian grouping). Returns e.g. "One Lakh Twenty Three Thousand"
function numberToWords(num) {
    if (num === undefined || num === null) return '';
    num = String(num).replace(/,/g, '').trim();
    if (num === '' || isNaN(num)) return '';

    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
    const tens = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

    function oneTo99(n) {
        n = Number(n);
        if (n < 10) return units[n];
        if (n < 20) return teens[n - 10];
        const t = Math.floor(n / 10);
        const u = n % 10;
        return tens[t] + (u ? ' ' + units[u] : '');
    }

    function convertHundred(n) {
        n = Number(n);
        if (n < 100) return oneTo99(n);
        const h = Math.floor(n / 100);
        const rem = n % 100;
        return units[h] + ' Hundred' + (rem ? ' ' + oneTo99(rem) : '');
    }

    let [intPart, decPart] = num.split('.');
    intPart = parseInt(intPart, 10) || 0;
    decPart = decPart ? decPart.slice(0,2) : '';

    let words = '';
    const crore = Math.floor(intPart / 10000000);
    intPart %= 10000000;
    const lakh = Math.floor(intPart / 100000);
    intPart %= 100000;
    const thousand = Math.floor(intPart / 1000);
    intPart %= 1000;
    const hundred = Math.floor(intPart / 100);
    const rest = intPart % 100;

    if (crore) words += convertHundred(crore) + ' Crore ';
    if (lakh) words += convertHundred(lakh) + ' Lakh ';
    if (thousand) words += convertHundred(thousand) + ' Thousand ';
    if (hundred) words += units[hundred] + ' Hundred ';
    if (rest) words += (hundred ? 'and ' : '') + oneTo99(rest) + ' ';

    words = words.trim();
    if (!words) words = 'Zero';

    if (decPart) {
        const decNum = parseInt(decPart.padEnd(2, '0'), 10) || 0;
        if (decNum) {
            words += ' and ' + oneTo99(decNum) + ' Paise';
        }
    }

    return words;
}

// Generate receipt based on form input
function generateReceipt() {
    // Validate form first so HTML5 required fields show errors
    const form = document.getElementById('receiptForm');
    if (!form.checkValidity()) {
        // show native browser validation messages
        form.reportValidity();
        return;
    }

    // Get form values
    const receiptNo = document.getElementById('receiptNo').value;
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const amountWords = document.getElementById('amountWords').value;
    /*const paymentMethod = document.getElementById('paymentMethod').value;*/
    const paymentRef = document.getElementById('paymentRef').value;
    const drawnOn = document.getElementById('drawnOn').value;
    const account = document.getElementById('account').value;
    const date = document.getElementById('date').value;
    const plotNo = document.getElementById('plotNo').value;
    const plotSize = document.getElementById('plotSize').value;
    const refId = document.getElementById('previewRefId').value;

    // Update preview
    document.getElementById('previewReceiptNo').textContent = receiptNo;
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewAmount').textContent = amount + '/-';
    document.getElementById('previewAmountWords').textContent = amountWords;
    //document.getElementById('previewPaymentMethod').textContent = paymentMethod;
    document.getElementById('previewPaymentRef').textContent = paymentRef;
    document.getElementById('previewDrawnOn').textContent = drawnOn;
    document.getElementById('previewAccount').textContent = account;

    // Fancy amount display (styled block with rupee icon as a circular span)
    const amountFooter = document.getElementById('previewAmountFooter');
    const amountNum = amount ? Number(amount).toLocaleString() : '0';
    amountFooter.innerHTML = `
        <div class="amount-inner">
            <span class="amount-icon" aria-hidden="true"><span class="rupee">₹</span></span>
            <div class="amount-text">
                <div class="amount-value">${amountNum}/-</div>
            </div>
        </div>
    `;

    // brief pop animation to draw attention when amount changes
    const receiptAmountEl = document.querySelector('.receipt-amount');
    if (receiptAmountEl) {
        receiptAmountEl.classList.remove('highlight-update');
        // force reflow
        void receiptAmountEl.offsetWidth;
        receiptAmountEl.classList.add('highlight-update');
        setTimeout(() => receiptAmountEl.classList.remove('highlight-update'), 700);
    }

    document.getElementById('previewDate').textContent = formatDateReceipt(date);
    document.getElementById('plotNochange').textContent = plotNo;
    // Ensure plot size in preview includes unit (Sq.Yrd) unless already provided
    let plotDisplay = plotSize ? plotSize.trim() : '';
    if (plotDisplay && !/\(|sq\.? *yrd/i.test(plotDisplay)) {
        plotDisplay = `${plotDisplay} (Sq.Yrd)`;
    }
    document.getElementById('plotSizechange').textContent = plotDisplay;
    document.getElementById('previewRefIdChange').textContent = refId;

    // Persist receipt number and advance it for next use
    try {
        const receiptInputEl = document.getElementById('receiptNo');
        const currentNum = parseInt(receiptInputEl.value, 10);
        if (!isNaN(currentNum)) {
            // Save the current (just used) receipt number
            localStorage.setItem('lastReceiptNo', String(currentNum));
            // Advance the input to the next number for convenience
            receiptInputEl.value = String(currentNum + 1);
        }
    } catch (e) {
        console.error('Failed to persist receipt number:', e);
    }

    // Update payment note based on payment method
    /*const paymentNote = document.getElementById('previewPaymentNote');
    if (paymentMethod === 'Cheque') {
        paymentNote.textContent = '(Cheques are subject to realisation)';
    } else if (paymentMethod === 'Credit Card') {
        paymentNote.textContent = '(Subject to bank approval)';
    } else if (paymentMethod === 'UPI') {
        paymentNote.textContent = '(Transaction ID: ' + paymentRef + ')';
    } else {
        paymentNote.textContent = '';
    }*/
}

// Download as PDF function for receipt
function downloadReceiptPDF() {
    // Use html2canvas and jsPDF
    const receiptElement = document.getElementById('receiptPreview');
    const name = document.getElementById('name').value.trim() || 'client';
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');

    const amount = document.getElementById('amount').value.trim() || '0';
    
    html2canvas(receiptElement, {
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
        
        // Add more pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Save the PDF
        pdf.save(`${safeName}_${amount}_payment_receipt.pdf`);
    });
}

// Save receipt as image
function saveReceiptAsImage() {
    try {
        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas library is not loaded. Please try another download method.');
            return;
        }
        
        const element = document.getElementById('receiptPreview');
        
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'payment_receipt.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => {
            alert('Error generating image: ' + error.message);
            console.error(error);
        });
    } catch (error) {
        alert('Error generating image: ' + error.message);
        console.error(error);
    }

}
