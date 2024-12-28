const SUM = "+";
const SUBTRACT = "-";
const MULTIPLY = "*";
const DIVIDE = "/";

let firstOperand;
let secondOperand;
let operator;

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

    console.log(`Now: ${firstOperand} ${operator}`);
}));