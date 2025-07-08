const appData = {
  patient: {
    name: "Erich Lehmann",
    org: "AOK Baden-Württemberg",
    profilePicUrl: "assets/images/erich.png",
  },
};

let uploadedFiles = [];

const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const fileTableContainer = document.getElementById("fileTableContainer");
const fileTableBody = document.querySelector("#fileListTable tbody");
const sendBtn = document.getElementById("sendBtn");
const browseBtn = document.getElementById("browseBtn");
const profilePic = document.getElementById("profilePic");
const profileInitials = document.getElementById("profileInitials");

function getInitials(name) {
  const parts = name.split(" ");
  const first = parts[0] ? parts[0][0] : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function populateData() {
  document.title = `Patientenversand - ${appData.patient.name}`;
  document.getElementById("patientNameHeader").textContent = appData.patient.name;
  document.getElementById("patientOrgHeader").textContent = appData.patient.org;
  profilePic.src = appData.patient.profilePicUrl;
}

profilePic.onerror = function () {
  profilePic.style.display = "none";
  profileInitials.textContent = getInitials(appData.patient.name);
  profileInitials.style.display = "flex";
};

uploadArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => handleFileArray(Array.from(e.target.files)));

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  uploadArea.addEventListener(
    eventName,
    () => uploadArea.classList.add("drag-over"),
    false
  );
});

["dragleave", "drop"].forEach((eventName) => {
  uploadArea.addEventListener(
    eventName,
    () => uploadArea.classList.remove("drag-over"),
    false
  );
});

uploadArea.addEventListener(
  "drop",
  (e) => {
    handleFileArray(Array.from(e.dataTransfer.files));
  },
  false
);

function handleFileArray(files) {
  files.forEach((file) => {
    if (file.size > 50 * 1024 * 1024) {
      alert(`Datei ${file.name} ist zu groß. Maximum: 50MB`);
      return;
    }
    if (uploadedFiles.some((f) => f.name === file.name)) {
      return;
    }
    uploadedFiles.push(file);
    addFileToTable(file);
  });
  updateUI();
}

function addFileToTable(file) {
  const row = fileTableBody.insertRow();
  row.innerHTML = `
    <td>${file.name}</td>
    <td>${formatFileSize(file.size)}</td>
    <td><button onclick="removeFile(this, '${file.name}')">Entfernen</button></td>
  `;
}

function removeFile(buttonElement, fileName) {
  uploadedFiles = uploadedFiles.filter((file) => file.name !== fileName);
  buttonElement.closest("tr").remove();
  updateUI();
}

function updateUI() {
  const hasFiles = uploadedFiles.length > 0;
  sendBtn.disabled = !hasFiles;

  if (hasFiles) {
    sendBtn.classList.add("button-primary");
    browseBtn.classList.remove("button-primary");
  } else {
    sendBtn.classList.remove("button-primary");
    browseBtn.classList.add("button-primary");
  }
  fileTableContainer.style.display = hasFiles ? "block" : "none";
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

sendBtn.addEventListener("click", async () => {
  if (sendBtn.disabled) return;

  sendBtn.disabled = true;
  sendBtn.textContent = "Daten werden gesendet...";
  sendBtn.classList.remove("button-primary");

  const uploadPromises = uploadedFiles.map((file) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    const allOk = results.every((res) => res.ok);

    if (allOk) {
      alert("Die Daten wurden erfolgreich an den Patienten versendet.");
    } else {
      alert("Ein Fehler ist aufgetreten. Nicht alle Dateien konnten gesendet werden.");
    }
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Ein schwerwiegender Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
  } finally {
    resetForm();
  }
});

function resetForm() {
  uploadedFiles = [];
  fileTableBody.innerHTML = "";
  fileInput.value = "";
  sendBtn.textContent = "Dateien an Patienten schicken";
  updateUI();
}

document.addEventListener("DOMContentLoaded", populateData);
