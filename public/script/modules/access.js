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