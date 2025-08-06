let display = document.getElementById("display");
let memory = 0; // Initialize memory

// Define a set of operators for easy checking.
// These are the characters that should trigger the replacement logic.
const operators = new Set(['+', '-', '*', '/', '^']);

/**
 * Appends a value (number, operator, or symbol) to the display.
 * If the value is an operator and the last character on display is also an operator,
 * the new operator replaces the old one.
 * @param {string} value The value to append.
 */
function appendValue(value) {
    const currentDisplay = display.value;
    const lastChar = currentDisplay.slice(-1); // Get the last character on the display

    // Check if the new 'value' is an operator AND the 'lastChar' on display is also an operator.
    if (operators.has(value) && operators.has(lastChar)) {
        // If both are operators, replace the last character with the new operator.
        display.value = currentDisplay.slice(0, -1) + value;
    } else {
        // Otherwise (if it's a number, a non-operator, or the display is empty/ends with a number),
        // simply append the value.
        display.value += value;
    }
}

/**
 * Clears the entire display.
 */
function clearDisplay() {
    display.value = "";
}

/**
 * Deletes the last character from the display.
 */
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

/**
 * Converts degrees to radians for trigonometric functions.
 * @param {number} degrees The angle in degrees.
 * @returns {number} The angle in radians.
 */
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Appends a scientific function name and an opening parenthesis to the display.
 * This allows the user to input the argument and close the parenthesis.
 * @param {string} func The name of the scientific function (e.g., 'sin', 'cos').
 */
function scientific(func) {
    display.value += func + '(';
}

/**
 * Adds the current display value to memory.
 * Clears the display after adding to memory.
 */
function memoryPlus() {
    const current = parseFloat(display.value);
    if (!isNaN(current)) {
        memory += current;
    }
    display.value = ""; // Clear display after adding to memory
    console.log("Memory:", memory); // For debugging
}

/**
 * Recalls the value from memory and appends it to the display.
 */
function memoryRecall() {
    display.value += memory;
}

/**
 * Clears the memory.
 * Clears the display after clearing memory.
 */
function memoryClear() {
    memory = 0;
    display.value = "";
    console.log("Memory cleared."); // For debugging
}

/**
 * Calculates and evaluates the expression on the display.
 * Handles auto-closing parentheses, replacing '^' with '**' for exponentiation,
 * and converting scientific functions/constants to their JavaScript equivalents.
 * Displays "Error" for invalid or uncomputable expressions.
 */
function calculate() {
    let expression = display.value;

    // Auto-close unmatched parentheses
    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    const missingParens = openParens - closeParens;

    if (missingParens > 0) {
        expression += ')'.repeat(missingParens);
    }

    // Replace '^' with '**' for exponentiation
    expression = expression.replace(/\^/g, '**');

    // Replace scientific functions with JavaScript equivalents
    expression = expression.replace(/sqr\(([^)]*)\)/g, 'Math.pow($1, 2)');
    expression = expression.replace(/sin\(([^)]*)\)/g, 'Math.sin(degToRad($1))');
    expression = expression.replace(/cos\(([^)]*)\)/g, 'Math.cos(degToRad($1))');
    expression = expression.replace(/tan\(([^)]*)\)/g, 'Math.tan(degToRad($1))');
    expression = expression.replace(/log\(([^)]*)\)/g, 'Math.log10($1)'); // Base 10 logarithm
    expression = expression.replace(/ln\(([^)]*)\)/g, 'Math.log($1)');   // Natural logarithm
    expression = expression.replace(/sqrt\(([^)]*)\)/g, 'Math.sqrt($1)');
    expression = expression.replace(/abs\(([^)]*)\)/g, 'Math.abs($1)');

    // Replace constants
    expression = expression.replace(/Pi/g, 'Math.PI');
    expression = expression.replace(/E/g, 'Math.E');

    try {
        // Use eval() to compute the result of the expression
        const result = eval(expression);
        // Display the result, or "Error" if the result is not a number or is infinite
        display.value = isNaN(result) || !isFinite(result) ? "Error" : result;
    } catch (error) {
        // Catch and log any errors during calculation, then display "Error"
        console.error("Calculation Error:", error);
        display.value = "Error";
    }
}
