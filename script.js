const SUM = "+";
const SUBTRACT = "-";
const MULTIPLY = "x";
const DIVIDE = "/";
const NO_OPERATION = "no_operation";

let firstOperand = 0;
let secondOperand = null;
let operator = null;
let result = null;

// Get primary display element
const primaryDisplay = document.querySelector(".primary-display");
primaryDisplay.textContent = "0";

// Get secondary display element
const secondaryDisplay = document.querySelector(".secondary-display");
secondaryDisplay.textContent = "Enter the first number";

// Handle operand button click
const operandButtons = document.querySelectorAll(".operand-btn");
operandButtons.forEach(btn => btn.addEventListener("click", () => {
    // Prevents leading one or more zeros.
    if(primaryDisplay.textContent === "0") {
        primaryDisplay.textContent = "";
    }

    primaryDisplay.textContent += btn.textContent;
}));

// Handle operator buttons click
const operatorButtons = document.querySelectorAll(".operator-btn");
operatorButtons.forEach(btn => btn.addEventListener("click", () => {
    firstOperand = result == null ? Number(primaryDisplay.textContent) : result;
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

    if (operator == null) operator = NO_OPERATION;

    operate();
});

// Handle Clear all (AC) button click
const clearAllButton = document.querySelector(".clear-all-btn");
clearAllButton.addEventListener("click", () => {
    firstOperand = 0;
    secondOperand = null;
    result = null;
    operator = null;
    primaryDisplay.textContent = "0";
    secondaryDisplay.textContent = "Enter the first number";
});

// Handle Clear (C) button click
const clearButton = document.querySelector(".clear-btn");

// Handle Signed (+/-) button click
const signedButton = document.querySelector(".signed-btn");


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
    }
    
    primaryDisplay.textContent = result;
    operator = null;
}