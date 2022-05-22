export async function getAccessToken() {
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
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      //Where to go after login
      window.location.href = "home.html";
    }
  } catch (err) {
    console.log("Unable to retrieve access token.");
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

export function getAccess() {
    const access = localStorage.getItem("access");
    if (access && access !== "undefined") {
      return access;
    } else {
      return false;
    }
  }