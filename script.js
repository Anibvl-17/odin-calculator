const SUM = "+";
const SUBTRACT = "-";
const MULTIPLY = "x";
const DIVIDE = "/";

let firstOperand;
let secondOperand;
let operator;
let result;

// Get primary display element
const primaryDisplay = document.querySelector(".primary-display");
primaryDisplay.textContent = "0";

// Get secondary display element
const secondaryDisplay = document.querySelector(".secondary-display");
secondaryDisplay.textContent = "Enter the first operand";

// Handle operand buttons
const operandButtons = document.querySelectorAll(".operand-btn");
operandButtons.forEach(btn => btn.addEventListener("click", () => {
    if(primaryDisplay.textContent === "0") {
        primaryDisplay.textContent = "";
    }

    primaryDisplay.textContent += btn.textContent;
}));

// Handle operator buttons
const operatorButtons = document.querySelectorAll(".operator-btn");
operatorButtons.forEach(btn => btn.addEventListener("click", () => {
    firstOperand = Number(primaryDisplay.textContent);
    operator = btn.textContent;
    secondaryDisplay.textContent = primaryDisplay.textContent + " " + btn.textContent;
    primaryDisplay.textContent = "0";
}));

// Handle operate (=) button
const operateButton = document.querySelector(".operate-btn")
operateButton.addEventListener("click", () => {
    secondOperand = Number(primaryDisplay.textContent);
    secondaryDisplay.textContent += " " + primaryDisplay.textContent;
    operate();
    primaryDisplay.textContent = result;
});

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

    console.log(result)
}