const SUM = "+";
const SUBTRACT = "-";
const MULTIPLY = "x";
const DIVIDE = "/";
const NO_OPERATION = "no_operation";
const FIRST_OPERAND = 1;
const SECOND_OPERAND = 2;

let currentOperand = FIRST_OPERAND;
let firstOperand = 0;
let secondOperand = 0;
let operator = NO_OPERATION;
let result = null;

// Get primary display element
const primaryDisplay = document.querySelector(".primary-display");
primaryDisplay.textContent = "0";

// Get secondary display element
const secondaryDisplay = document.querySelector(".secondary-display");
secondaryDisplay.textContent = "Enter the first number";

// Handle operand button click
// - At first use, the firstOperand is updated.
// - After an operator is clicked, the currentOperand is SECOND_OPERAND
//   and the secondOperand is updated.
// - If an operator is clicked, and instead of operate the user clicks
//   an operator again, then the result becomes the first operand,
//   and the secondOperand is updated.
const operandButtons = document.querySelectorAll(".operand-btn");
operandButtons.forEach(btn => btn.addEventListener("click", () => {

    if (operator == NO_OPERATION && result != null) {
        clearAll();
    }

    // Prevents leading one or more zeros.
    if(primaryDisplay.textContent === "0") {
        primaryDisplay.textContent = "";
    }

    primaryDisplay.textContent += btn.textContent;

    currentOperand == FIRST_OPERAND ? 
        firstOperand  = Number(primaryDisplay.textContent):
        secondOperand = Number(primaryDisplay.textContent);
}));

// Handle operator buttons click
// - If an operator is clicked, update the secondaryDisplay with the primaryDisplay content
// - If another operator is clicked without clicking operate, then automatically
//   operate
const operatorButtons = document.querySelectorAll(".operator-btn");
operatorButtons.forEach(btn => btn.addEventListener("click", () => {
    const lastOperatorButton = document.querySelector(".active-operator");
    if(lastOperatorButton != null) {
    
        operate();
        lastOperatorButton.classList.remove("active-operator");
    }

    btn.classList.add("active-operator");

    currentOperand = SECOND_OPERAND;
    operator = btn.textContent;
    secondaryDisplay.textContent = primaryDisplay.textContent + " " + btn.textContent;
    primaryDisplay.textContent = "0";
}));

// Handle operate (=) button click
const operateButton = document.querySelector(".operate-btn")
operateButton.addEventListener("click", () => {
    secondOperand = Number(primaryDisplay.textContent);

    // Removes any character that is not a digit
    if (!Number.isFinite(secondaryDisplay.textContent)) {
        secondaryDisplay.textContent = primaryDisplay.textContent;
    } else {
        secondaryDisplay.textContent += " " + primaryDisplay.textContent;
    }

    operate();
});

// Handle Clear all (AC) button click
const clearAllButton = document.querySelector(".clear-all-btn");
clearAllButton.addEventListener("click", clearAll);

// Handle Clear (C) button click
const clearButton = document.querySelector(".clear-btn");

// Handle Signed (+/-) button click
const signedButton = document.querySelector(".signed-btn");

function clearAll() {
    firstOperand = 0;
    secondOperand = 0;
    operator = NO_OPERATION;
    result = null;
    currentOperand = FIRST_OPERAND;
    primaryDisplay.textContent = "0";
    secondaryDisplay.textContent = "Enter the first number";
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
            result = firstOperand / secondOperand;
            break;
        case NO_OPERATION:
            firstOperand = Number(primaryDisplay.textContent);
            result = firstOperand;
            break;
        default:
            if (!Number.isInteger(firstOperand))
                console.error(`First number ${firstOperand} is not integer`);
            else if (!Number.isInteger(secondOperand))
                console.error(`Second number ${secondOperand} is not integer`);
            else if (operator !== "+" || operator !== "-" || operator !== "x" || operator !== "/")
                console.error(`Invalid operator "${operator}"`);
            else
                console.error("Unexpected error.");
            break;
    }

    if(operator != NO_OPERATION) {
        secondaryDisplay.textContent = `${firstOperand} ${operator} ${secondOperand}`;
        document.querySelector(".active-operator").classList.remove("active-operator");
    }
    
    primaryDisplay.textContent = result;
    firstOperand = result;
    secondOperand = 0;
    operator = NO_OPERATION;
    currentOperand = FIRST_OPERAND;
}