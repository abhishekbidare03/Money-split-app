document.getElementById('addRecordBtn').addEventListener('click', createForm);

function createForm() {
    // Create form section dynamically
    const formSection = document.createElement('div');
    formSection.classList.add('form-section');

    formSection.innerHTML = `
        <label>Name: <input type="text"  class="name-input"></label>
        <label>Amount: <input type="number"  class="amount-input"></label>
        <label>Spent On: <input type="text"  class="spent-input"></label>
        <button class="add-btn">Submit</button>
    `;

    document.getElementById('records').insertAdjacentElement('beforebegin', formSection);
    
    formSection.querySelector('.add-btn').addEventListener('click', function () {
        const name = formSection.querySelector('.name-input').value.trim();
        const amount = formSection.querySelector('.amount-input').value.trim();
        const spentOn = formSection.querySelector('.spent-input').value.trim();

        if (name && amount && spentOn) {
            displayRecord(name, amount, spentOn);
            formSection.remove();
        } else {
            alert('Please fill out all fields correctly.');
        }
    });
}

function displayRecord(name, amount, spentOn) {
    const recordList = document.getElementById('records');

    const recordItem = document.createElement('div');
    recordItem.classList.add('record-item');

    recordItem.innerHTML = `
        <span><strong>${name}</strong> spent <strong>₹${amount}</strong> on ${spentOn}</span>
        <button class="delete-btn">&times;</button>
    `;

    recordItem.querySelector('.delete-btn').addEventListener('click', function () {
        recordItem.remove();
    });

    recordList.insertBefore(recordItem, recordList.firstChild);
}

document.getElementById('totalBtn').addEventListener('click', TotalAmount);

function TotalAmount() {
    let total = 0;
    const recordItems = document.querySelectorAll('.record-item');
    let expenditureRecords = [];

    recordItems.forEach(function (recordItem) {
        const name = recordItem.querySelector('strong:first-child').textContent;
        const amountText = recordItem.querySelector('strong:nth-child(2)').textContent;
        const amount = parseInt(amountText.replace('₹', ''));
        expenditureRecords.push({ name, amount });
        total += amount;
    });

    const totalAmountElement = document.getElementById('totalAmount');
    totalAmountElement.innerHTML = `Total Amount: ₹${total} <button id="split-bill" class="tot-btn">Split Bill</button>`;

    const splitButton = document.getElementById('split-bill');
    splitButton.style.display = 'inline-block';

    splitButton.addEventListener('click', function () {
        if (expenditureRecords.length === 0) {
            alert('No records found to split.');
            return;
        }

        displaySplitResults(expenditureRecords, total);
        splitButton.style.display = 'none';
        totalBtn.style.display = 'none';
    });
}

function displaySplitResults(records, total) {
    const existingResult = document.getElementById('split-result');
    if (existingResult) existingResult.remove();

    const maxSpender = records.reduce((max, person) => person.amount > max.amount ? person : max, records[0]);
    const perPersonAmount = (total / records.length).toFixed(2);

    const splitResult = document.createElement('div');
    splitResult.id = 'split-result';
    splitResult.classList.add('result-container');
    splitResult.innerHTML = `
        <p><strong>Highest Spender:</strong> ${maxSpender.name} spent ₹${maxSpender.amount}</p>
        <p>Each person owes: ₹${perPersonAmount}</p>
        <button id="download-btn" class="tot-btn">Download </button>
    `;

    document.getElementById('totalAmount').appendChild(splitResult);

    document.getElementById('download-btn').addEventListener('click', downloadExpenditureAsImage);
}

function downloadExpenditureAsImage() {
    html2canvas(document.querySelector('.container')).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'expenditure.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}
