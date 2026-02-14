const toggleButton = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme") || "light";
const main = document.getElementsByTagName("main")[0];
main.classList.add(savedTheme);

if (toggleButton) {
  toggleButton.textContent =
    savedTheme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode";

  toggleButton.addEventListener("click", () => {
    if (main.classList.contains("light")) {
      main.classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
      toggleButton.textContent = "Switch to Light Mode";
    } else {
      main.classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
      toggleButton.textContent = "Switch to Dark Mode";
    }
  });
}
