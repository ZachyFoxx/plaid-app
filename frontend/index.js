const API_URI = "http://localhost:3000"; // Our API endpoint

// Constants for elements that will be modified later
const ERROR_DIV = document.getElementById("error-div");
const INITIAL_DIV = document.getElementById("initial");
const SUCCESS_DIV = document.getElementById("success");
const ACCESS_INPUT_ELEMENT = document.getElementById("access-input");
// run this asynchronously!
(async ($) => {
  // Generate a link token for the user
  const createLinkToken = async () => {
    const res = await fetch(API_URI + "/api/create_token");
    const data = await res.json();
    const linkToken = data.link_token;
    ERROR_DIV.style.display = "none"; // hide the error card
    INITIAL_DIV.style.display = "block"; // Show the welcome card, now that we know we have no errors

    localStorage.setItem("link_token", linkToken); // set our link token in local storage

    return linkToken;
  };

  // Create our Plaid client instance
  // We just assume our client wants to link a bank at this point
  const plaid = Plaid.create({
    token: await createLinkToken(),
    onSuccess: async (publicToken) => {
      // Make our exchange request to get our access token
      const request = await fetch(API_URI + "/api/exchange_token", {
        method: "POST",
        body: JSON.stringify({ public_token: publicToken }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("access_token", (await request.json()).access_token); // Set access token in local storage, pls no do in production.
      ACCESS_INPUT_ELEMENT.value = localStorage.getItem("access_token"); // Set our input, or rather output box to display the access token
      INITIAL_DIV.style.display = "none"; // hide the welcome card
      SUCCESS_DIV.style.display = "block"; // Show our :sparkle: fancy :sparkle: thank you card.
    },
  });

  // Make our button initialise the plaid proccess
  const linkAccountButton = document.getElementById("link-account");
  linkAccountButton.addEventListener("click", () => {
    plaid.open();
  });
})();

// Copy token to the users clipboard
function copyToken() {
  navigator.clipboard.writeText(
    localStorage.getItem("access_token") ||
      "BOO! Bet I scared ya, you shouldn't be able to see this!"
  );
  document.getElementById("copied-bread-crumb").style.display = "block";
}
