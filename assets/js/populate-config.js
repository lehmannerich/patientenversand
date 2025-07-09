document.addEventListener("DOMContentLoaded", () => {
  // --- Helper function to safely set text content ---
  const setText = (id, text) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  };

  // --- Helper function to safely set an attribute ---
  const setAttr = (id, attr, value) => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute(attr, value);
    }
  };

  // --- Populate common elements ---
  setText("project-name-title", config.project.name);
  setText("patient-name-header", config.patient.name);
  setText("patient-org-header", config.patient.organization);

  setAttr("profile-pic-header", "src", config.patient.profilePicture);

  // --- Populate page-specific elements ---

  // Index page
  setText("owner-name-index", config.patient.name);
  setAttr("github-link-index", "href", config.project.githubLink);
  setText("github-link-index", config.project.githubLink); // Also set the text
  setAttr("portal-link-index", "href", config.project.portalPage);
  setText("portal-link-index", `Zum Portal von ${config.patient.name}`);

  // Compliance page
  setText("patient-name-compliance", config.patient.name);
  setText("patient-email-compliance", config.patient.email);
  setAttr("github-link-compliance", "href", config.project.githubLink);

  // Impressum (Imprint) page
  setText("impressum-name", config.patient.name);
  setText("impressum-street", config.patient.address.street);
  setText("impressum-city", config.patient.address.city);
  setText("impressum-email", config.patient.email);

  // User/Patient Portal page
  setText("max-file-size-text", config.upload.maxFileSizeMB);
});
