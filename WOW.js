// script.js
let balance = 0;

// ฟังก์ชันสำหรับอัปเดตยอดเงินใน localStorage และแสดงผล
function updateBalance() {
  localStorage.setItem('balance', balance);
  document.getElementById('balance').innerText = balance;
  document.getElementById('message').innerText = '';  // ลบข้อความก่อนหน้า
}

// ฟังก์ชันโหลดยอดเงินจาก localStorage
function loadBalance() {
  const storedBalance = localStorage.getItem('balance');
  if (storedBalance !== null) {
    balance = parseFloat(storedBalance);
  }
  updateBalance();
}

// ฟังก์ชันการฝากเงิน
function deposit() {
  const depositAmount = parseFloat(document.getElementById('deposit-amount').value);
  if (isNaN(depositAmount) || depositAmount <= 0) {
    document.getElementById('message').innerText = 'กรุณากรอกจำนวนเงินที่ถูกต้อง';
    return;
  }
  balance += depositAmount;
  updateBalance();
  saveTransaction('ติดเงิน', depositAmount);
  document.getElementById('deposit-amount').value = '';  // ลบค่าที่กรอก
  document.getElementById('message').innerText = `ติดเงิน ${depositAmount} บาท สำเร็จ`;
}

// ฟังก์ชันการถอนเงิน
function withdraw() {
  const withdrawAmount = parseFloat(document.getElementById('withdraw-amount').value);
  const fileInput = document.getElementById('file-input');
  const selectedFile = fileInput.files[0];

  if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    document.getElementById('message').innerText = 'กรุณากรอกจำนวนเงินที่ถูกต้องสำหรับ';
    return;
  }

  if (withdrawAmount > balance) {
    document.getElementById('message').innerText = 'ยอดเงินไม่เพียงพอ';
    return;
  }

  if (!selectedFile) {
    document.getElementById('message').innerText = 'กรุณาแนบรูปภาพเพื่อใช้';
    return;
  }

  balance -= withdrawAmount;
  updateBalance();
  saveTransaction('ใช้', withdrawAmount);
  document.getElementById('withdraw-amount').value = '';  // ลบค่าที่กรอก
  fileInput.value = '';  // ลบไฟล์ที่เลือก
  document.getElementById('message').innerText = `ใช้เงิน ${withdrawAmount} บาท สำเร็จ`;
}

// ฟังก์ชันบันทึกข้อมูลการทำรายการลงใน localStorage
function saveTransaction(type, amount) {
  const transaction = {
    type: type,
    amount: amount,
    date: new Date().toLocaleString()
  };

  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));

  displayTransactions();
}

// ฟังก์ชันแสดงประวัติการทำรายการ
function displayTransactions() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';  // ลบข้อมูลเก่าออก

  transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.innerHTML = `${transaction.date} - ${transaction.type}: ${transaction.amount} บาท`;
    historyList.appendChild(li);
  });
}

// โหลดข้อมูลเมื่อหน้าโหลด
window.onload = function() {
  loadBalance();
  displayTransactions();
};
