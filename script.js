const overallContainer = document.getElementById("overall-container");
const roundEl = document.getElementById("round");
const flagEl = document.querySelector(".flag");
const capitalEl = document.querySelector(".capital");
const populationEl = document.querySelector(".population");
const pickRegionForm = document.getElementById("pick-region-form");
const choicesForm = document.getElementById("choices-form");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");
const replayButton = document.getElementById("replay-button");

let allCountries = [];
let unchosenCountriesTemp = [];
let unchosenCountries = [];
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
let regionChoice = "";
let randomCountryIndex = -1;
let userChoice = -1;
let correctChoice = -1;
const totalRounds = 10;
let currentRound = 0;
let score = 0;

const pickRegion = function (event) {
  event.preventDefault();

  for (let i = 1; i < 7; i++) {
    if (document.getElementById(`region-choice${i}`).checked) {
      regionChoice = document.getElementById(`region-choice${i}`).value;
    }
  }
  let endpoint =
    regionChoice === "all" ? regionChoice : `region/${regionChoice}`;
  console.log(endpoint);
  document.querySelector(".pick-region").hidden = true;
  fetchData(endpoint);
};

// Fetch data about all countries
const fetchData = function (endpoint) {
  fetch(`https://restcountries.com/v3.1/${endpoint}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      allCountries = data;
      unchosenCountries = data;
      unchosenCountriesTemp = data;
      document.getElementById("total-container").hidden = false;
      playRound();
    })
    .catch((err) => console.log(`Error occured: ${err}`));

  //   https://restcountries.com/v3.1/all
};

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
  countryInputs[userChoice].checked = false;
  userChoice = -1;
  correctChoice = -1;
  if (currentRound < totalRounds) playRound();
  else {
    alert(`Game complete! You scored ${score} out of ${totalRounds}`);
    document.getElementById("total-container").hidden = true;
    replayButton.hidden = false;
  }
  submitButton.removeAttribute("hidden");
  nextButton.hidden = true;
};

const playRound = function () {
  currentRound++;
  roundEl.textContent = `${currentRound}/${totalRounds}`;
  // Select random country and display data
  let correctCountryIndex = Math.floor(
    Math.random() * unchosenCountries.length
  );
  let correctCountry = unchosenCountries[correctCountryIndex];
  unchosenCountries.splice(correctCountryIndex, 1);
  unchosenCountriesTemp = [...unchosenCountries];
  flagEl.src = correctCountry.flags.png;
  capitalEl.textContent = correctCountry.capital;
  populationEl.textContent = correctCountry.population;

  // Populate multiple choices
  correctChoice = Math.floor(Math.random() * 4 + 1);

  for (let i = 1; i <= 4; i++) {
    if (i == correctChoice) {
      countryChoices[i].textContent = correctCountry.name.common;
    } else {
      randomCountryIndex = Math.floor(Math.random() * unchosenCountries.length);

      while (unchosenCountries[randomCountryIndex] === correctCountry) {
        randomCountryIndex = Math.floor(
          Math.random() * unchosenCountries.length
        );
      }
      countryChoices[i].textContent =
        unchosenCountries[randomCountryIndex].name.common;
      unchosenCountries.splice(randomCountryIndex, 1);
    }
  }
  console.log("Before:", unchosenCountries, unchosenCountriesTemp);
  unchosenCountries = [...unchosenCountriesTemp];
  console.log("After:", unchosenCountries, unchosenCountriesTemp);
};

const replayGame = function () {
  // Replay a game
  score = 0;
  currentRound = 0;
  userChoice = -1;
  correctChoice = -1;
  unchosenCountries = allCountries.map((x) => x);
  unchosenCountriesTemp = allCountries.map((x) => x);

  replayButton.hidden = true;
  document.getElementById("total-container").hidden = true;
  document.querySelector(".pick-region").hidden = false;
};

pickRegionForm.addEventListener("submit", pickRegion);
choicesForm.addEventListener("submit", recordChoice);
nextButton.addEventListener("click", nextRound);
replayButton.addEventListener("click", replayGame);
