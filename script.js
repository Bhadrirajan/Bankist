'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Bhadrinath Govindarajan',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  transactiondate: [
    '2019-03-25T12:00:00Z',
    '2020-03-25T12:00:00Z',
    '2020-08-29T12:00:00Z',
    '2021-11-03T12:00:00Z',
    '2023-03-25T12:00:00Z',
    '2023-06-22T12:00:00Z',
    '2023-10-16T12:00:00Z',
    '2023-12-25T12:00:00Z',
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  transactiondate: [
    '2019-03-25T12:00:00Z',
    '2020-03-25T12:00:00Z',
    '2020-08-29T12:00:00Z',
    '2021-11-03T12:00:00Z',
    '2023-03-25T12:00:00Z',
    '2023-06-22T12:00:00Z',
    '2023-10-16T12:00:00Z',
    '2023-12-25T12:00:00Z',
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  transactiondate: [
    '2019-03-25T12:00:00Z',
    '2020-03-25T12:00:00Z',
    '2020-08-29T12:00:00Z',
    '2021-11-03T12:00:00Z',
    '2023-03-25T12:00:00Z',
    '2023-06-22T12:00:00Z',
    '2023-10-16T12:00:00Z',
    '2023-12-25T12:00:00Z',
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  transactiondate: [
    '2019-03-25T12:00:00Z',
    '2020-03-25T12:00:00Z',
    '2020-08-29T12:00:00Z',
    '2021-11-03T12:00:00Z',
    '2023-03-25T12:00:00Z',
    '2023-06-22T12:00:00Z',
    '2023-10-16T12:00:00Z',
    '2023-12-25T12:00:00Z',
  ],
  interestRate: 1,
  pin: 4444,
};

const bankAccount = [account1, account2, account3, account4];
let loggedInUser;
let sorted = false;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  ComputeUsername(bankAccount);
  const d = new Date();
  const formatteddate = dateFormater(d);
  labelDate.innerHTML = `${formatteddate[formatteddate.length - 3]}/${
    formatteddate[formatteddate.length - 2]
  }/${formatteddate[formatteddate.length - 1]}`;
  countDownTimer();
  loggedInUser = bankAccount.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (Number(inputLoginPin.value) === loggedInUser?.pin) {
    labelWelcome.innerHTML = `Welcome back ${loggedInUser.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    calculateBalance(loggedInUser);
    displayMovement(loggedInUser);
    calculateSummary(loggedInUser.movements, loggedInUser.interestRate);
  }
});
//Transfer amount
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAccountDetail = inputTransferTo.value;
  const transferAmountDetail = Number(inputTransferAmount.value);
  const transferTo = accounts.find(
    acc => acc.userName === transferAccountDetail
  );
  if (
    transferAmountDetail < loggedInUser.balance &&
    transferTo.userName != loggedInUser.userName
  ) {
    const loggedUserTransaction = loggedInUser.movements.push(
      -transferAmountDetail
    );
    const trnsDate = new Date().toISOString();
    const loggedUserTransactionDate =
      loggedInUser.transactiondate.push(trnsDate);
    const ReceivedUser = transferTo.movements.push(transferAmountDetail);

    updateUI(loggedInUser);
  }
});
//Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmUserName = inputCloseUsername.value;
  const ConfirmPin = inputClosePin.value;
  if (
    confirmUserName === loggedInUser.userName &&
    Number(ConfirmPin) === loggedInUser.pin
  ) {
    const closingAccount = accounts.findIndex(
      acc => acc.userName === confirmUserName
    );
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    labelWelcome.innerHTML = `Log in to get started`;
    containerApp.style.opacity = 0;
  }
});
//request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestedLoanAmount = inputLoanAmount.value;
  const eligibility = loggedInUser.movements.some(mov => mov >= 0.1);
  if (eligibility) {
    const loanReceived = setTimeout(function () {
      loggedInUser.movements.push(Number(requestedLoanAmount));

      updateUI(loggedInUser);
    }, 2500);

    const loanRequestDate = new Date().toISOString();
    const loggedUserloanRequest =
      loggedInUser.transactiondate.push(loanRequestDate);
  } else {
  }
});
//sort implementation
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(loggedInUser, !sorted);
  sorted = !sorted;
});

//calculating total balance
function calculateBalance(accountData) {
  accountData.balance = accountData.movements.reduce(
    (acc, mov) => acc + mov,
    0
  );
  labelBalance.innerHTML = `${accountData.balance.toFixed(2)}$`;
}
//display account transactions
function displayMovement(currentacc, sort = false) {
  containerMovements.innerHTML = '';
  const accMovements = currentacc.movements;
  const accTransactionsDetails = currentacc.transactiondate;
  const sortedDetails = [];
  for (let i = 0; i < accMovements.length; i++) {
    const type = accMovements[i] > 0 ? `deposit` : `withdrawal`;
    const combinedobj = {
      movements: accMovements[i],
      transactiondate: accTransactionsDetails[i],
      transactiontype: type,
      transactionindex: i + 1,
    };
    sortedDetails.push(combinedobj);
  }
  const sortedMovements =
    sort === true
      ? sortedDetails.sort((a, b) => b.movements - a.movements)
      : sortedDetails;
  sortedMovements.forEach(function (movement, index) {
    //let type = movement.movements > 0 ? `deposit` : `withdrawal`;

    let transferedDate = new Date(movement.transactiondate);

    const movementDate = dateFormater(transferedDate);
    let display = `<div class="movements__row">
    <div class="movements__type movements__type--${movement.transactiontype}">
      ${movement.transactionindex} ${movement.transactiontype}
    </div>
    <div class="movements__date">${movementDate[movementDate.length - 3]}/${
      movementDate[movementDate.length - 2]
    }/${movementDate[movementDate.length - 1]}</div>
    <div class="movements__value">${Math.floor(movement.movements)}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', display);
  });
}

//calculating summary of account
function calculateSummary(mov, interestRate) {
  const deposit = mov.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.innerHTML = `${deposit.toFixed(2)}$`;
  const withdrawal = mov
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.innerHTML = `${withdrawal.toFixed(2)}$`;
  const intrest = mov
    .filter(mov => mov > 950)
    .map(mov => mov * (interestRate / 100))
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.innerHTML = `${intrest.toFixed(2)}$`;
}
//Countdown timer for log out
function countDownTimer() {
  let startTimer = 300;
  const tick = function () {
    let min = String(Math.trunc(startTimer / 60)).padStart(2, 0);
    let sec = startTimer % 60;
    labelTimer.textContent = `${min}:${sec}`;
    if (startTimer === 0) {
      clearInterval(count);
      inputLoginPin.value = '';
      inputLoginUsername.value = '';
      labelWelcome.innerHTML = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    startTimer--;
  };
  const count = setInterval(tick, 1000);
}
//creating username from account
function ComputeUsername(accDetails) {
  accDetails.forEach(
    Uname =>
      (Uname.userName = Uname.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
}
//Formatting date
function dateFormater(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const tdyDate = date.getDate();
  return [tdyDate, month, year];
}
//UpdateUI
function updateUI(signedInUser) {
  calculateBalance(signedInUser);
  displayMovement(signedInUser);
  calculateSummary(signedInUser.movements, signedInUser.interestRate);
}
