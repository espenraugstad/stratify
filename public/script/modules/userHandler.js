import { getAccess } from './accessHandler.js';

export async function getCurrentUser(){
    const url = "https://api.spotify.com/v1/me";

  const cfg = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + getAccess(),
    },
  };

  try {
    let res = await fetch(url, cfg);
    if (res.status === 401) {
      refresh();
    } else if (res.status === 200) {
      let data = await res.json();
      localStorage.setItem("user", data.id);
      //currentUser.innerHTML = `${data.display_name}`;
      return data.display_name;
    } else {
      throw "Unable to get current user";
    }
  } catch (err) {
    console.log(err);
  }
}