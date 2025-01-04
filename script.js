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
const calculatorState = {
  currentOperand: FIRST_OPERAND,
  firstOperand: 0,
  secondOperand: 0,
  operator: NO_OPERATION,
  result: null,
  isOperatorActive: false,
};

const ERROR_BAD_FIRST_OPERAND = `First operand ${calculatorState.firstOperand} is not valid`;
const ERROR_BAD_SECOND_OPERAND = `Second operand ${calculatorState.secondOperand} is not valid`;
const ERROR_BAD_OPERATOR = `Invalid operator "${calculatorState.operator}"`;
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
  if (calculatorState.operator == NO_OPERATION && calculatorState.result != null) {
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
  // Reset operator, true: and operate
  resetActiveOperator(true);

  if (isErrorState()) {
    return;
  }

  calculatorState.currentOperand = SECOND_OPERAND;
  calculatorState.operator = this.textContent;
  this.classList.add("active-operator");
  calculatorState.isOperatorActive = true;

  let primaryDisplayText = primaryDisplay.textContent;

  if (primaryDisplayText.endsWith(".")) {
    primaryDisplayText = primaryDisplayText.slice(0, -1);
  }

  secondaryDisplay.textContent = `${primaryDisplayText} ${calculatorState.operator}`;
  primaryDisplay.textContent = TEXT_ZERO;
  calculatorState.secondOperand = 0;
}

function handleOperateClick() {
  if (isErrorState()) return;
  
  resetActiveOperator();
  updateOperand();
  operate();
}

function handleClearClick() {
  if (isErrorState()) {
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
  if (isErrorState()) {
    clearAll();
    return;
  }

  primaryDisplay.textContent = Number(primaryDisplay.textContent) * -1;
  updateOperand();
}

function handleDotClick() {
  if (isErrorState()) {
    clearAll();
  } else if (primaryDisplay.textContent.includes(".")) {
    return;
  }

  primaryDisplay.textContent += ".";
}

// Automatically updates operand according to the currentOperand value
function updateOperand() {
  calculatorState.currentOperand == FIRST_OPERAND
    ? (calculatorState.firstOperand = Number(primaryDisplay.textContent))
    : (calculatorState.secondOperand = Number(primaryDisplay.textContent));
}

function updateHistory() {
  if (calculatorState.result == null) return;

  // Prevents duplication of history and clears the NO_HISTORY message
  historyContainer.textContent = TEXT_EMPTY;

  history.unshift(`${calculatorState.firstOperand} ${calculatorState.operator} ${calculatorState.secondOperand} = ${calculatorState.result}`);

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
  switch (calculatorState.operator) {
    case NO_OPERATION: return; // <- Notice the return statement here!
    case SUM:
      calculatorState.result = calculatorState.firstOperand + calculatorState.secondOperand;
      break;
    case SUBTRACT:
      calculatorState.result = calculatorState.firstOperand - calculatorState.secondOperand;
      break;
    case MULTIPLY:
      calculatorState.result = calculatorState.firstOperand * calculatorState.secondOperand;
      break;
    case DIVIDE:
      if (!Number.isFinite(calculatorState.firstOperand / calculatorState.secondOperand)) {
        clearAll();
        primaryDisplay.textContent = ERROR_DIVISION;
        return;
      }

      calculatorState.result = calculatorState.firstOperand / calculatorState.secondOperand;
      break;
    default:
      if (!Number.isFinite(calculatorState.firstOperand))
        console.error(ERROR_BAD_FIRST_OPERAND);
      else if (!Number.isFinite(calculatorState.secondOperand))
        console.error(ERROR_BAD_SECOND_OPERAND);
      else if (
        calculatorState.operator !== SUM &&
        calculatorState.operator !== SUBTRACT &&
        calculatorState.operator !== MULTIPLY &&
        calculatorState.operator !== DIVIDE
      )
        console.error(ERROR_BAD_OPERATOR);
      else console.error(ERROR_UNEXPECTED);
      break;
  }

  if (calculatorState.operator != NO_OPERATION) {
    secondaryDisplay.textContent = `${calculatorState.firstOperand} ${calculatorState.operator} ${calculatorState.secondOperand} =`;
  }

  updateHistory();
  primaryDisplay.textContent = calculatorState.result;
  calculatorState.firstOperand = calculatorState.result;
  calculatorState.secondOperand = 0;
  calculatorState.currentOperand = FIRST_OPERAND;
  calculatorState.operator = NO_OPERATION;
}

// Resets all values and displays
function clearAll() {
  calculatorState.firstOperand = 0;
  calculatorState.secondOperand = 0;
  calculatorState.operator = NO_OPERATION;
  resetActiveOperator();
  calculatorState.result = null;
  calculatorState.currentOperand = FIRST_OPERAND;
  primaryDisplay.textContent = TEXT_ZERO;
  secondaryDisplay.textContent = TEXT_INITIAL;
}

function resetActiveOperator(andOperate = false) {
  if (calculatorState.isOperatorActive) {
    document
      .querySelector(".active-operator")
      .classList.remove("active-operator");
    calculatorState.isOperatorActive = false;

    if (andOperate) operate();
  }
}

function isErrorState() {
  return primaryDisplay.textContent == ERROR_DIVISION;
}