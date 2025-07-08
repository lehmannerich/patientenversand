document.addEventListener("DOMContentLoaded", function () {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  const headerHTML = `
    <div class="header-left">
      <a href="index.html" class="home-link">Patientenversand</a>
    </div>
  `;

  headerPlaceholder.innerHTML = `<header>${headerHTML}</header>`;
});
