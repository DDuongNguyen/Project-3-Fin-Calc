document.addEventListener('DOMContentLoaded', () => {
  // ---------------all the loaded HTML selectors---------------------------------
  const calculator = document.querySelector('#retirement-calculator');

  const inputs = calculator.querySelectorAll('input');

  const fundsTodayInput = calculator.querySelector('#funds-today');
  const retirementExpensesInput = calculator.querySelector('#retirement-expenses');

  const ageInput = calculator.querySelector('#age');
  const ageLabel = calculator.querySelector('#age-label');

  const retirementAgeInput = calculator.querySelector('#retirement-age');
  const retirementAgeLabel = calculator.querySelector('#retirement-age-label');

  const investmentGainRateInput = calculator.querySelector('#investment-growth');
  const investmentGainRateLabel = calculator.querySelector('#investment-growth-label');

  const inflationRateInput = calculator.querySelector('#inflation');
  const inflationRateLabel = calculator.querySelector('#inflation-label');

  const safeWithdrawalRateInput = calculator.querySelector('#safe-withdrawal');
  const safeWithdrawalRateLabel = calculator.querySelector('#safe-withdrawal-label');

  const taxRateInput = calculator.querySelector('#tax');
  const taxRateLabel = calculator.querySelector('#tax-label');

  const outputDiv = calculator.querySelector('#retirement-result');

  const fundsToday = parseFloat(fundsTodayInput.value) || 0;
  const retirementExpenses = parseFloat(retirementExpensesInput.value) || 0;
  const age = parseFloat(ageInput.value) || 0;
  const retirementAge = parseFloat(retirementAgeInput.value) || 0;
  const inflationRate = parseFloat(inflationRateInput.value) / 100.0 || 0;
  const safeWithdrawalRate = parseFloat(safeWithdrawalRateInput.value) / 100.0 || 1;
  const investmentGainRate = parseFloat(investmentGainRateInput.value) / 100.0 || 0;
  const taxRate = parseFloat(taxRateInput.value) / 100.0 || 0;

// ----------load the input
  labelingInput(
    ageLabel,
    retirementAgeLabel,
    investmentGainRateLabel,
    safeWithdrawalRateLabel,
    age, safeWithdrawalRate,
    investmentGainRate,
    taxRate,
    inflationRate,
    retirementAge,
    taxRateLabel,
    inflationRateLabel)

//  ----------upload the input as user changes it
  updateLabel()

// ------------validate -> calculate -> slap output onto the DOM---------
  document.querySelector("#calculate").addEventListener('click', () => {
    validateInput(
      parseFloat(fundsTodayInput.value),
        parseFloat(retirementExpensesInput.value),
        parseFloat(ageInput.value),
        parseFloat(retirementAgeInput.value),
        outputDiv,
        (parseFloat(investmentGainRateInput.value) / 100.0),
        (parseFloat(inflationRateInput.value) / 100.0),
        (parseFloat(taxRateInput.value) / 100.0),
        (parseFloat(safeWithdrawalRateInput.value) / 100.0)
        )


})
})

// ------------read existing record from the database------------------
  fetchRecords()

// ------------delete button event listener-------------
  document.querySelector('#record-list').addEventListener('click', () => clickDelegation(event))

// -------------------------------------------------------------------------------
// -------------------------END OF DOMContentLoaded--------------------------------
// --------------------------------------------------------------------------------

// -------------------------------LOGIK----------------------------------------------
// ---------------labeling the inputs----------------------------------------
function labelingInput(
  ageLabel,
  retirementAgeLabel,
  investmentGainRateLabel,
  safeWithdrawalRateLabel,
  age,
  safeWithdrawalRate,
  investmentGainRate,
  taxRate,
  inflationRate,
  retirementAge,
  taxRateLabel,
  inflationRateLabel){

  ageLabel.innerHTML = 'Current age: ' + age.toFixed(0);
  retirementAgeLabel.innerHTML = 'Target retirement age: ' + retirementAge.toFixed(0);

  let safeWithdrawalRateText = (safeWithdrawalRate * 100).toFixed(2);
  safeWithdrawalRateText += '% safe withdrawal rate';
  safeWithdrawalRateLabel.innerHTML = safeWithdrawalRateText;

  let investmentGainRateText = (investmentGainRate * 100).toFixed(2);
  investmentGainRateText += '% annual investment growth rate';
  investmentGainRateLabel.innerHTML = investmentGainRateText;

  let taxRateText = (taxRate * 100).toFixed(0);
  taxRateText += '% tax rate on retirement withdrawals';
  taxRateLabel.innerHTML = taxRateText;

  let inflationRateText = (inflationRate * 100).toFixed(2);
  inflationRateText += '% annual expense inflation rate';
  inflationRateLabel.innerHTML = inflationRateText
}

// ------validate the inputs ----------------------
function validateInput(
  fundsToday,
  retirementExpenses,
  age,
  retirementAge,
  outputDiv,
  investmentGainRateInput,
  inflationRateInput,
  taxRateInput,
  safeWithdrawalRateInput
){
    event.preventDefault()
  if (outputDiv) {
    outputDiv.innerHTML = ''
    if (fundsToday <= 0.0) {
      outputDiv.innerHTML += '<div class="result-error">To calculate retirement freedom, enter a current retirement account balance greater than zero</div>';
      ;
    }
    if (retirementExpenses <= 0.0) {
      outputDiv.innerHTML += '<div class="result-error">Set retirement annual expenses to a value greater than zero</div>';
      ;
    }
    if (age >= retirementAge) {
      outputDiv.innerHTML += '<div class="result-error">Set a target retirement age greater than your current age</div>';
      ;
    }
  }


  if(!outputDiv.innerText){
    // debugger
    slapOutput(
        fundsToday,
        investmentGainRateInput,
        retirementAge,
        age,
        retirementExpenses,
        inflationRateInput,
        taxRateInput,
        safeWithdrawalRateInput)
        // calculator.querySelector('#retirement-result'))
    }

  }

// ------------------changing number to currency------------------
function toCurrency(value){
  if (value == 0) {
    return '-';
  } else {
    return '$' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

// --------------------slap output on DOM ---------------------------------
function slapOutput(
  fundsToday,
  investmentGainRate,
  retirementAge,
  age,
  retirementExpenses,
  inflationRate,
  taxRate,
  safeWithdrawalRate,
  outputDiv){
  const fundsAtRetirement = fundsToday * Math.pow(1 + investmentGainRate, retirementAge - age);
  const targetFunds = retirementExpenses * Math.pow(1 + inflationRate, retirementAge - age) / (1 - taxRate) / safeWithdrawalRate;

  let result = document.querySelector('#retirement-result');
  // debugger
  if (fundsAtRetirement >= targetFunds) {
    result.innerHTML = "<h5>Congrats, you are able to retire!</h5>";
  } else {
    result.innerHTML = "<h5>You're not ready to retire yet. Keep saving!</h5>";
  }

  result.innerHTML +=
    `<ul>
  <li>To retire at ${retirementAge}, you'll need ${toCurrency(targetFunds)} </li>
  <li>Based on what you entered, at ${retirementAge}, you would have ${toCurrency(fundsAtRetirement)}</li>
  </ul>`
  document.querySelector("#save").addEventListener('click',() => fetchCreateRecord(
  fundsToday,
  investmentGainRate,
  retirementAge,
  age,
  retirementExpenses,
  inflationRate,
  taxRate,
  safeWithdrawalRate,
  targetFunds,
  fundsAtRetirement))
}

// -----------------------Update label as user changes input----------------------
function updateLabel(){
  document.querySelector('#age').addEventListener('input', (e) => {
    document.querySelector('#age-label').innerHTML = `Current age: ${e.target.value}`
  })

  document.querySelector('#retirement-age').addEventListener('input', (e) => {
    document.querySelector('#retirement-age-label').innerHTML = `Target retirement age: ${e.target.value}`
  })

  document.querySelector('#investment-growth').addEventListener('input', (e) => {
    document.querySelector('#investment-growth-label').innerHTML = `${e.target.value}% annual investment growth rate`
  })

  document.querySelector('#inflation').addEventListener('input', (e) => {
    document.querySelector('#inflation-label').innerHTML = `${e.target.value}% annual expense inflation rate`
  })

  document.querySelector('#tax').addEventListener('input', (e) => {
    document.querySelector('#tax-label').innerHTML = `${e.target.value}% tax rate on retirement withdrawals`
  })

  document.querySelector('#safe-withdrawal').addEventListener('input', (e) => {
    document.querySelector('#safe-withdrawal-label').innerHTML = `${e.target.value}% safe withdrawal rate`
  })

}

// ----------------------Click delegation-----------------------------------
function clickDelegation(event){
if(event.target.className === "delete_button"){
  fetchRemoveRecord(event)
}
}

// ----------------------------------------------------------------------------
// ------------------------END OF LOGIK-----------------------------------------
// --------------------------------------------------------------------------------

// -----------------------Fetching---------------------------------------------
function fetchCreateRecord(
fundsToday,
investmentGainRate,
retirementAge,
age,
retirementExpenses,
inflationRate,
taxRate,
safeWithdrawalRate,
targetFunds,
fundsAtRetirement){
event.preventDefault()
fetch('http://localhost:3000/records',{
method:'POST',
headers: {
  "content-type": "application/json"
},
body: JSON.stringify({
  user_id: 1,
  annual_expense: retirementExpenses,
  saving_balance: fundsToday,
  age: age,
  retirement_age: retirementAge,
  safe_withdrawal_rate: safeWithdrawalRate*100,
  investment_growth: investmentGainRate*100,
  inflation: inflationRate*100,
  tax_rate: taxRate*100,
  target_fund: targetFunds ,
  fund_at_retirement: fundsAtRetirement
})
})
.then(resp => resp.json())
.then(slapNewRecord)
}

function fetchRecords(){
  fetch('http://localhost:3000/records')
  .then(resp => resp.json())
  .then(slapRecords)
}

function fetchRemoveRecord(event){
  // debugger
  recordId = event.target.dataset.deleteid
  fetch(`http://localhost:3000/records/${recordId}`,{
  method: "delete"})
  event.target.parentElement.parentElement.remove()
}

// ------------------------------------------------------------------------
// -----------------------END OF FETCHING--------------------------------------
// ---------------------------------------------------------------------------

// -------------------SLAP ON DOMS------------------------------------------

function slapNewRecord(data){
  recordList= document.querySelector("#record-list")
  recordList.innerHTML+=`
  <li data-recordId= "${data.id}">
  <h5>User: ${data.user_id}- Scenario: ${data.id} <button class='delete_button' data-deleteId=${data.id} >DELETE</button> </h5>
  <p>Target retirement age: ${data.retirement_age}</p>
  <p>Current Retirement Account Balance: ${data.saving_balance}</p>
  <p>Retirement Annual Expenses: ${data.annual_expense}</p>
  <p>${data.investment_growth}% annual investment growth rate</p>
  <p>${data.inflation}% annual expense inflation rate</p>
  <p>${data.tax_rate}% tax rate on retirement withdrawals</p>
  <p>${data.safe_withdrawal_rate}% safe withdrawal rate</p>
  <h5>To retire at ${data.retirement_age}, you'll need ${toCurrency(data.target_fund)}</h5>
  <h5>Based on what you entered, at ${data.retirement_age}, you would have ${toCurrency(data.fund_at_retirement)}</h5>
  </li>
  `
}

function slapRecords(datas){
  recordList= document.querySelector("#record-list")
  // debugger
  datas.forEach(data => {
  recordList.innerHTML+=`
  <li data-recordId= "${data.id}">
  <h5>User: ${data.user_id}- Scenario: ${data.id} <button class='delete_button' data-deleteId=${data.id} >DELETE</button> </h5>
  <p>Target retirement age: ${data.retirement_age}</p>
  <p>Current Retirement Account Balance: ${data.saving_balance}</p>
  <p>Retirement Annual Expenses: ${data.annual_expense}</p>
  <p>${data.investment_growth}% annual investment growth rate</p>
  <p>${data.inflation}% annual expense inflation rate</p>
  <p>${data.tax_rate}% tax rate on retirement withdrawals</p>
  <p>${data.safe_withdrawal_rate}% safe withdrawal rate</p>
  <h5>To retire at ${data.retirement_age}, you'll need ${toCurrency(data.target_fund)}</h5>
  <h5>Based on what you entered, at ${data.retirement_age}, you would have ${toCurrency(data.fund_at_retirement)}</h5>
  </li>
  `
})
}
// ------------------------------------------------------------------------
// -------------------END OF SLAPPIN----------------------------------------------
// --------------------------------------------------------------------------
