document.addEventListener("DOMContentLoaded", function () {
  var footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("components/footer.html")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then(function (data) {
        footerPlaceholder.innerHTML = data;
      })
      .catch(function (error) {
        console.error("Error loading footer:", error);
        footerPlaceholder.innerHTML =
          "<p style='text-align: center; color: red;'>Error loading footer content.</p>";
      });
  }
});
