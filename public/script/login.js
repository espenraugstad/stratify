window.onload = function () {
  // If the code is available in the url, get the access token
  if (window.location.search.length > 0) {
    getAccessToken();
  }
};

// Prevent the back-button on the browser from being used after logout
window.onpopstate = function(event) {
  alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}

// Login-button
document.getElementById("loginBtn").addEventListener("click", () => {
  window.location.href = "/login";
});

async function getAccessToken() {
  const url = "/getAccessToken";

  const cfg = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code: getCode() }),
  };

  try {
    let res = await fetch(url, cfg);
    let data = await res.json();

    if (res.status !== 200) {
      throw data.error;
    } else {
      localStorage.setItem("access", data.access_token);
      localStorage.setItem("refresh", data.refresh_token);
      //Where to go after login
      window.location.href = "home.html";
    }
  } catch (err) {
    console.log("Ooops");
    console.log(err);
  }
}

function getCode() {
  let code = "";
  const query = window.location.search;
  if (query.length > 0) {
    const urlParams = new URLSearchParams(query);
    code = urlParams.get("code");
  }

  return code;
}
