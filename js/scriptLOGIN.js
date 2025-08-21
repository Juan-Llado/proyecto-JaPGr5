 const btn = document.getElementById("button-modebackground");
    btn.addEventListener("click", () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute("data-bs-theme");
      html.setAttribute("data-bs-theme", currentTheme === "dark" ? "light" : "dark");
    });
