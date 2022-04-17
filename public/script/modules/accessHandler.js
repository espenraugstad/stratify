export function checkAccess() {
  const access = localStorage.getItem("access");
  if (access && access !== "undefined") {
    return;
  } else {
    window.location.href = "index.html";
  }
}

export function getAccess() {
    const access = localStorage.getItem("access"); 
    if (access && access !== "undefined") {
        return access;
      } else {
        return false;
      }
}

export async function refresh() {
  const refreshToken = localStorage.getItem("refresh");
  const url = "/refreshToken";
  const cfg = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: localStorage.getItem("refresh") }),
  };

  try {
    let res = await fetch(url, cfg);
    let data = await res.json();
    if (res.status === 200) {
      localStorage.setItem("access",data.access_token);
      window.location.href = "dashboard.html";
    } else {
      throw data.error;
    }
  } catch (err) {
    console.log("Unable to get refresh token");
    console.log(err);
  }
}