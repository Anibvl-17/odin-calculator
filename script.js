const SUM = "+";
const SUBTRACT = "-";
const MULTIPLY = "x";
const DIVIDE = "/";
const NO_OPERATION = "no_operation";
const ERROR_DIVISION = "I guess we'll never know...";

const FIRST_OPERAND = 1;
const SECOND_OPERAND = 2;
let currentOperand = FIRST_OPERAND;

let firstOperand = 0;
let secondOperand = 0;
let operator = NO_OPERATION;
let result = null;

let isOperatorActive = false;

const primaryDisplay = document.querySelector(".primary-display");
const secondaryDisplay = document.querySelector(".secondary-display");

primaryDisplay.textContent = "0";
secondaryDisplay.textContent = "Enter the first number";

// Handle operand button click
const operandButtons = document.querySelectorAll(".operand-btn");
operandButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    // Clear all if there is a result and a new number is being typed
    if (operator == NO_OPERATION && result != null) {
      clearAll();
    }

    // Prevents leading one or more zeros, or clear if the display is
    // showing the ERROR_DIVISION message
    if (
      primaryDisplay.textContent === "0" ||
      primaryDisplay.textContent === ERROR_DIVISION
    ) {
      primaryDisplay.textContent = "";
    }

    primaryDisplay.textContent += btn.textContent;

    updateOperand();
  })
);

// Handle operator buttons click
const operatorButtons = document.querySelectorAll(".operator-btn");
operatorButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
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
    operator = btn.textContent;
    btn.classList.add("active-operator");
    isOperatorActive = true;

    let primaryDisplayText = primaryDisplay.textContent;

    if (primaryDisplayText.endsWith(".")) {
      primaryDisplayText = primaryDisplayText.slice(0, -1);
    }

    secondaryDisplay.textContent = primaryDisplayText + " " + operator;
    primaryDisplay.textContent = "0";
    secondOperand = 0;
  })
);

// Handle operate (=) button click
const operateButton = document.querySelector(".operate-btn");
operateButton.addEventListener("click", () => {
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
});

// Handle Clear all (AC) button click
document.querySelector(".clear-all-btn").addEventListener("click", clearAll);

// Handle Clear (C) button click
document.querySelector(".clear-btn").addEventListener("click", () => {
  if (
    primaryDisplay.textContent == ERROR_DIVISION ||
    (operator == NO_OPERATION && result != null)
  ) {
    clearAll();
    return;
  }

  primaryDisplay.textContent = primaryDisplay.textContent.slice(0, -1);
  updateOperand();

  if (primaryDisplay.textContent == "" || primaryDisplay.textContent == "-") {
    primaryDisplay.textContent = "0";
  }
});

// Handle Signed (+/-) button click
document.querySelector(".signed-btn").addEventListener("click", () => {
  if (
    primaryDisplay.textContent == ERROR_DIVISION ||
    (operator == NO_OPERATION && result != null)
  ) {
    clearAll();
    return;
  }

  primaryDisplay.textContent = Number(primaryDisplay.textContent) * -1;
  updateOperand();
});

// Handle Dot (.) button click
document.querySelector(".dot-btn").addEventListener("click", () => {
  if (operator == NO_OPERATION && result != null) {
    clearAll();
  } else if (primaryDisplay.textContent.includes(".")) {
    return;
  }

  primaryDisplay.textContent += ".";
});

// Automatically updates operand according to the currentOperand value
function updateOperand() {
  currentOperand == FIRST_OPERAND
    ? (firstOperand = Number(primaryDisplay.textContent))
    : (secondOperand = Number(primaryDisplay.textContent));
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
        console.error(`First operand ${firstOperand} is not valid`);
      else if (!Number.isFinite(secondOperand))
        console.error(`Second operand ${secondOperand} is not valid`);
      else if (
        operator !== SUM &&
        operator !== SUBTRACT &&
        operator !== MULTIPLY &&
        operator !== DIVIDE
      )
        console.error(`Invalid operator "${operator}"`);
      else console.error("Unexpected error.");
      break;
  }

  if (operator != NO_OPERATION) {
    secondaryDisplay.textContent = `${firstOperand} ${operator} ${secondOperand} =`;
  }

  primaryDisplay.textContent = result;
  firstOperand = result;
  secondOperand = 0;
  currentOperand = FIRST_OPERAND;
  operator = NO_OPERATION;
}

function clearAll() {
  firstOperand = 0;
  secondOperand = 0;
  operator = NO_OPERATION;
  isOperatorActive = false;
  result = null;
  currentOperand = FIRST_OPERAND;
  primaryDisplay.textContent = "0";
  secondaryDisplay.textContent = "Enter the first number";
}
