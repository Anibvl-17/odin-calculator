const SUM = "+";
const SUBTRACT = "-";
const MULTIPLY = "x";
const DIVIDE = "/";
const NO_OPERATION = "no_operation";

const TEXT_NO_HISTORY = "No history yet";
const TEXT_ZERO = "0";
const TEXT_INITIAL = "Enter the first number";
const TEXT_EMPTY = "";

const FIRST_OPERAND = 1;
const SECOND_OPERAND = 2;
let currentOperand = FIRST_OPERAND;

let firstOperand = 0;
let secondOperand = 0;
let operator = NO_OPERATION;
let result = null;
let isOperatorActive = false;

const ERROR_BAD_FIRST_OPERAND = `First operand ${firstOperand} is not valid`;
const ERROR_BAD_SECOND_OPERAND = `Second operand ${secondOperand} is not valid`;
const ERROR_BAD_OPERATOR = `Invalid operator "${operator}"`;
const ERROR_DIVISION = "I guess we'll never know...";
const ERROR_UNEXPECTED = "Unexpected error.";

// History of operations, saved as "firstOperand operator secondOperand = result"
const history = [];

const primaryDisplay = document.querySelector(".primary-display");
const secondaryDisplay = document.querySelector(".secondary-display");
const historyContainer = document.querySelector(".last-results");

primaryDisplay.textContent = TEXT_ZERO;
secondaryDisplay.textContent = TEXT_INITIAL;
historyContainer.textContent = TEXT_NO_HISTORY;

// Add event listeners to all operand buttons
document.querySelectorAll(".operand-btn").forEach((operandButton) =>
  operandButton.addEventListener("click", handleOperandClick)
);

// Add event listeners to all operator buttons
document.querySelectorAll(".operator-btn").forEach((operatorButton) => 
  operatorButton.addEventListener("click", handleOperatorClick)
);

document.querySelector(".operate-btn").addEventListener("click", handleOperateClick);
document.querySelector(".signed-btn").addEventListener("click", handleSignedClick);
document.querySelector(".clear-all-btn").addEventListener("click", clearAll);
document.querySelector(".clear-btn").addEventListener("click", handleClearClick);
document.querySelector(".dot-btn").addEventListener("click", handleDotClick);

function handleOperandClick() {
  // Clear all if there is a result and a new number is being typed
  if (operator == NO_OPERATION && result != null) {
    clearAll();
  }

  // Clears leading zeros and error messages
  if (
    primaryDisplay.textContent === TEXT_ZERO ||
    primaryDisplay.textContent === ERROR_DIVISION
  ) {
    primaryDisplay.textContent = TEXT_EMPTY;
  }

  primaryDisplay.textContent += this.textContent;

  updateOperand();
}

function handleOperatorClick() {
  if (isOperatorActive) {
    document
      .querySelector(".active-operator")
      .classList.remove("active-operator");
    operate();
  }

  if (primaryDisplay.textContent == ERROR_DIVISION) {
    return;
  }

  currentOperand = SECOND_OPERAND;
  operator = this.textContent;
  this.classList.add("active-operator");
  isOperatorActive = true;

  let primaryDisplayText = primaryDisplay.textContent;

  if (primaryDisplayText.endsWith(".")) {
    primaryDisplayText = primaryDisplayText.slice(0, -1);
  }

  secondaryDisplay.textContent = `${primaryDisplayText} ${operator}`;
  primaryDisplay.textContent = TEXT_ZERO;
  secondOperand = 0;
}

function handleOperateClick() {
  if (isOperatorActive) {
    document
      .querySelector(".active-operator")
      .classList.remove("active-operator");
    isOperatorActive = false;
  }

  if (primaryDisplay.textContent == ERROR_DIVISION) {
    return;
  }

  updateOperand();
  operate();
}

function handleClearClick() {
  if (
    primaryDisplay.textContent == ERROR_DIVISION ||
    (operator == NO_OPERATION && result != null)
  ) {
    clearAll();
    return;
  }

  primaryDisplay.textContent = primaryDisplay.textContent.slice(0, -1);
  updateOperand();

  if (
    primaryDisplay.textContent == TEXT_EMPTY ||
    primaryDisplay.textContent == SUBTRACT
  ) {
    primaryDisplay.textContent = TEXT_ZERO;
  }
}

function handleSignedClick() {
  if (
    primaryDisplay.textContent == ERROR_DIVISION ||
    (operator == NO_OPERATION && result != null)
  ) {
    clearAll();
    return;
  }

  primaryDisplay.textContent = Number(primaryDisplay.textContent) * -1;
  updateOperand();
}

function handleDotClick() {
  if (operator == NO_OPERATION && result != null) {
    clearAll();
  } else if (primaryDisplay.textContent.includes(".")) {
    return;
  }

  primaryDisplay.textContent += ".";
}

// Automatically updates operand according to the currentOperand value
function updateOperand() {
  currentOperand == FIRST_OPERAND
    ? (firstOperand = Number(primaryDisplay.textContent))
    : (secondOperand = Number(primaryDisplay.textContent));
}

function updateHistory() {
  if (result == null) return;

  // Prevents duplication of history and clears the NO_HISTORY message
  historyContainer.textContent = TEXT_EMPTY;

  history.unshift(`${firstOperand} ${operator} ${secondOperand} = ${result}`);

  if (history.length > 5) {
    history.pop();
  }

  history.forEach((historyEntry) => {
    let historyP = document.createElement("p");
    historyP.textContent = historyEntry;
    historyContainer.appendChild(historyP);
  });
}

// Operates according to the operator value, usign firstOperand and secondOperand.
// Throws console.error() if there are invalid values
function operate() {
  switch (operator) {
    case SUM:
      result = firstOperand + secondOperand;
      break;
    case SUBTRACT:
      result = firstOperand - secondOperand;
      break;
    case MULTIPLY:
      result = firstOperand * secondOperand;
      break;
    case DIVIDE:
      if (
        secondOperand == 0 ||
        !Number.isFinite(firstOperand / secondOperand)
      ) {
        clearAll();
        primaryDisplay.textContent = ERROR_DIVISION;
        return;
      }

      result = firstOperand / secondOperand;
      break;
    case NO_OPERATION:
      firstOperand = Number(primaryDisplay.textContent);
      result = firstOperand;
      break;
    default:
      if (!Number.isFinite(firstOperand))
        console.error(ERROR_BAD_FIRST_OPERAND);
      else if (!Number.isFinite(secondOperand))
        console.error(ERROR_BAD_SECOND_OPERAND);
      else if (
        operator !== SUM &&
        operator !== SUBTRACT &&
        operator !== MULTIPLY &&
        operator !== DIVIDE
      )
        console.error(ERROR_BAD_OPERATOR);
      else console.error(ERROR_UNEXPECTED);
      break;
  }

  if (operator != NO_OPERATION) {
    secondaryDisplay.textContent = `${firstOperand} ${operator} ${secondOperand} =`;
  }

  updateHistory();
  primaryDisplay.textContent = result;
  firstOperand = result;
  secondOperand = 0;
  currentOperand = FIRST_OPERAND;
  operator = NO_OPERATION;
}

// Resets all values and displays
function clearAll() {
  if (isOperatorActive) {
    document
      .querySelector(".active-operator")
      .classList.remove("active-operator");
  }
  firstOperand = 0;
  secondOperand = 0;
  operator = NO_OPERATION;
  isOperatorActive = false;
  result = null;
  currentOperand = FIRST_OPERAND;
  primaryDisplay.textContent = TEXT_ZERO;
  secondaryDisplay.textContent = TEXT_INITIAL;
}
