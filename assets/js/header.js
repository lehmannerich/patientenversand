document.addEventListener("DOMContentLoaded", function () {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch("components/header.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        headerPlaceholder.innerHTML = data;
      })
      .catch((error) => {
        console.error("Error loading header:", error);
        headerPlaceholder.innerHTML =
          "<p style='text-align: center; color: red;'>Error loading header content.</p>";
      });
  }
});
