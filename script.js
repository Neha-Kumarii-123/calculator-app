// DOM Elements
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const themeToggle = document.querySelector('.theme-toggle');
let currentInput = '0';
let calculationHistory = [];
let isDarkTheme = true;

// Initialize calculator
function init() {
  updateDisplay();
  addKeyboardSupport();
}

// Add number to display
function appendNumber(num) {
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    // Prevent multiple decimals
    if (num === '.' && currentInput.includes('.')) {
      const lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
      if (lastNumber.includes('.')) return;
    }
    currentInput += num;
  }
  updateDisplay();
}

// Add operation to display
function appendOperation(op) {
  const lastChar = currentInput.slice(-1);
  const operations = ['+', '-', '*', '/', '('];
  
  if (currentInput === '0' && op !== '(') {
    return;
  }
  
  if (operations.includes(lastChar) && operations.includes(op)) {
    // Replace the last operation if another operation is pressed
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay();
}

// Calculate result
function calculate() {
  try {
    // Replace visual symbols with JavaScript operators
    let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    
    // Validate parentheses
    if (!validateParentheses(expression)) {
      throw new Error('Mismatched parentheses');
    }
    
    const result = eval(expression);
    
    // Add to history
    calculationHistory.push(`${currentInput} = ${result}`);
    if (calculationHistory.length > 3) {
      calculationHistory.shift();
    }
    updateHistory();
    
    currentInput = result.toString();
    updateDisplay();
  } catch (error) {
    displayError();
  }
}

// Display error
function displayError() {
  currentInput = 'Error';
  updateDisplay();
  setTimeout(() => {
    currentInput = '0';
    updateDisplay();
  }, 1000);
}

// Clear display
function clearDisplay() {
  currentInput = '0';
  updateDisplay();
}

// Backspace function
function backspace() {
  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

// Update display
function updateDisplay() {
  // Replace operators with visual symbols for display
  let displayValue = currentInput
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/-/g, '−');
  display.value = displayValue;
}

// Update history display
function updateHistory() {
  historyDisplay.textContent = calculationHistory.join(' | ');
}

// Validate parentheses
function validateParentheses(expr) {
  let stack = [];
  for (let char of expr) {
    if (char === '(') {
      stack.push(char);
    } else if (char === ')') {
      if (stack.length === 0) return false;
      stack.pop();
    }
  }
  return stack.length === 0;
}

// Toggle theme
function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  
  const icon = themeToggle.querySelector('i');
  icon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
  
  // Add animation
  themeToggle.style.transform = 'scale(1.1)';
  setTimeout(() => {
    themeToggle.style.transform = 'scale(1)';
  }, 200);
}

// Add keyboard support
function addKeyboardSupport() {
  document.addEventListener('keydown', (e) => {
    if (/[0-9.]/.test(e.key)) {
      appendNumber(e.key);
    } else if (/[+\-*/]/.test(e.key)) {
      appendOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      calculate();
    } else if (e.key === 'Backspace') {
      backspace();
    } else if (e.key === 'Escape') {
      clearDisplay();
    } else if (e.key === '(' || e.key === ')') {
      appendOperation(e.key);
    }
  });
}

// Initialize calculator
window.onload = init;