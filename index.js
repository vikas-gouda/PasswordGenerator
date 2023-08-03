const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_+{}[]:"<>?;./';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// set the circle color to grey
setIndicator("#ccc");

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;

  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);

  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  // to make copy sapn visisble
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

function shufflePassword(array) {
  //Fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = array[i];
  }

  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  // none of the checkbox are selected
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkbox;
    handleSlider();
  }

  //removing the previous password
  password = "";

  //lets put the characters mention by checkboxes

  // if (uppercaseCheck.checked) {
  //   password += generateUpperCase();
  // }
  // if (lowercaseCheck.checked) {
  //   password += generateLowerCase();
  // }
  // if (numbers.checked) {
  //   password += generateRandomNumber();
  // }
  // if (symbols.checked) {
  //   password += generateSymbol();
  // }

  let functArr = [];

  if (uppercaseCheck.checked) {
    functArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    functArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    functArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    functArr.push(generateSymbol);
  }

  //compulsory addition
  for (let i = 0; i < functArr.length; i++) {
    password += functArr[i]();
  }

  //remaining addition
  for (let i = 0; i < passwordLength - functArr.length; i++) {
    let randIndex = getRndInteger(0, functArr.length);
    password += functArr[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //show in UI
  passwordDisplay.value = password;

  //calculate strength
  calcStrength();
});
