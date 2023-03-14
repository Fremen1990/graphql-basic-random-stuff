const Quotes = require("inspirational-quotes");

function rootValue() {
  const getRandomDiceThrow = (sides) => {
    return Math.floor(Math.random() * sides) + 1;
  };
  const today = new Date().getDay();
  const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const randomCoinToss = () => Math.random() < 0.5;
  const getRandomCoinTossesUntilTrue = () => {
    const tosses = [];
    let toss = randomCoinToss();
    while (!toss) {
      tosses.push(toss);
      toss = randomCoinToss();
    }
    tosses.push(toss);
    return tosses;
  };
  return {
    greeting: "Hello world!",
    schrodingerCatGreeting: randomCoinToss() ? "Meow" : null,
    interestingUrls: ["https://www.google.com", "https://www.youtube.com"],
    randomDiceThrow: [
      getRandomDiceThrow(6),
      getRandomDiceThrow(6),
      getRandomDiceThrow(6),
    ],
    pi: Math.PI,
    isItFriday: today === 5,
    randomCoinTossesUntilTrue: getRandomCoinTossesUntilTrue(),
    today: DAYS_OF_WEEK[today],
    workDays: DAYS_OF_WEEK.slice(1, 6),
    randomQuote: Quotes.getQuote(),
  };
}

module.exports = rootValue;