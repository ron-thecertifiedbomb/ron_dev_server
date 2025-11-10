import { header } from "./components/header.js";
import  counter from "./components/counter.js"
const main = document.getElementById("main");

main.appendChild(
  header("Welcome to Classic JS", "This is a typical HTML + JS approach.")
);
main.appendChild(counter());


console.log('Javascript is running via classic.html (client side rendering)')

