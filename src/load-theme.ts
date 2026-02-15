const toggleButton = document.getElementById("themeToggle");

if (toggleButton) {
  toggleButton.textContent = document.documentElement.classList.contains(
    "light",
  )
    ? "Switch to Dark Mode"
    : "Switch to Light Mode";

  toggleButton.addEventListener("click", () => {
    if (document.documentElement.classList.contains("light")) {
      document.documentElement.classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
      toggleButton.textContent = "Switch to Light Mode";
    } else {
      document.documentElement.classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
      toggleButton.textContent = "Switch to Dark Mode";
    }
  });
}
