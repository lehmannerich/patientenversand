document.addEventListener("DOMContentLoaded", function () {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("components/footer.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        footerPlaceholder.innerHTML = data;
      })
      .catch((error) => {
        console.error("Error loading footer:", error);
        footerPlaceholder.innerHTML =
          "<p style='text-align: center; color: red;'>Error loading footer content.</p>";
      });
  }
});
