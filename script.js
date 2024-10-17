const overallContainer = document.getElementById("overall-container");
const roundEl = document.getElementById("round");
const flagEl = document.querySelector(".flag");
const capitalEl = document.querySelector(".capital");
const populationEl = document.querySelector(".population");
const choicesForm = document.getElementById("choices-form");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");

let allCountries = [];
const countryChoices = [];
const countryInputs = [];
const inputDivs = [];
countryChoices[1] = document.getElementById("country1");
countryChoices[2] = document.getElementById("country2");
countryChoices[3] = document.getElementById("country3");
countryChoices[4] = document.getElementById("country4");
countryInputs[1] = document.getElementById("country-choice1");
countryInputs[2] = document.getElementById("country-choice2");
countryInputs[3] = document.getElementById("country-choice3");
countryInputs[4] = document.getElementById("country-choice4");
inputDivs[1] = document.getElementById("input-row1");
inputDivs[2] = document.getElementById("input-row2");
inputDivs[3] = document.getElementById("input-row3");
inputDivs[4] = document.getElementById("input-row4");
let randomCountryIndex = -1;
let userChoice = -1;
let correctChoice = -1;
const totalRounds = 10;
let currentRound = 0;
let score = 0;

// Fetch data about all countries
fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    allCountries = data;
    playRound();
  })
  .catch((err) => console.log(`Error occured: ${err}`));

const recordChoice = function (event) {
  // Determine which country the user selected
  event.preventDefault();
  for (let i = 1; i < 5; i++) {
    if (countryInputs[i].checked) {
      userChoice = i;
    }
  }
  if (userChoice === correctChoice) {
    console.log("Correct guess!");
    inputDivs[userChoice].style.background = "green";
    score++;
  } else {
    console.log("Incorrect guess!");
    inputDivs[userChoice].style.background = "red";
    inputDivs[correctChoice].style.background = "green";
  }
  nextButton.removeAttribute("hidden");
  submitButton.hidden = true;
};

const nextRound = function () {
  // Start new round
  inputDivs[userChoice].style.background = "none";
  inputDivs[correctChoice].style.background = "none";
  if (currentRound < totalRounds) playRound();
  else {
    alert(`Game complete! You scored ${score} out of ${totalRounds}`);
    overallContainer.hidden = true;
  }
  submitButton.removeAttribute("hidden");
  nextButton.hidden = true;
  countryInputs[userChoice].checked = false;
};

const playRound = function () {
  currentRound++;
  roundEl.textContent = `${currentRound}/${totalRounds}`;
  // Select random country and display data
  let correctCountryIndex = Math.floor(Math.random() * allCountries.length);
  let correctCountry = allCountries[correctCountryIndex];
  console.log(correctCountry);
  flagEl.src = correctCountry.flags.png;
  capitalEl.textContent = correctCountry.capital;
  populationEl.textContent = correctCountry.population;

  // Populate multiple choices
  correctChoice = Math.floor(Math.random() * 4 + 1);

  for (let i = 1; i <= 4; i++) {
    if (i == correctChoice) {
      countryChoices[i].textContent = correctCountry.name.common;
      allCountries.splice(correctCountryIndex, 1);
    } else {
      randomCountryIndex = Math.floor(Math.random() * allCountries.length);
      countryChoices[i].textContent =
        allCountries[randomCountryIndex].name.common;
      allCountries.splice(randomCountryIndex, 1);
    }
  }
};

choicesForm.addEventListener("submit", recordChoice);
nextButton.addEventListener("click", nextRound);
