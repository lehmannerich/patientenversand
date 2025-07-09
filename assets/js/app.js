document.addEventListener("DOMContentLoaded", () => {
  const patientName = config.patient.name;
  const patientOrg = config.patient.organization;
  const patientProfilePic = config.patient.profilePicture;
  const patientInitials = config.patient.initials;
  const maxFileSize = config.upload.maxFileSizeMB * 1024 * 1024; // Convert MB to bytes

  const patientNameHeader = document.getElementById("patientNameHeader");
  const patientOrgHeader = document.getElementById("patientOrgHeader");
  if (patientNameHeader) patientNameHeader.textContent = patientName;
  if (patientOrgHeader) patientOrgHeader.textContent = patientOrg;

  if (profilePic) {
    profilePic.src = patientProfilePic;
    profilePic.onerror = () => {
      profilePic.style.display = "none";
      if (profileInitials) {
        profileInitials.style.display = "flex";
        profileInitials.textContent = patientInitials;
      }
    };
  }

  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput");
  const fileTableContainer = document.getElementById("fileTableContainer");
  const fileTableBody = document.querySelector("#fileListTable tbody");
  const sendBtn = document.getElementById("sendBtn");
  const browseBtn = document.getElementById("browseBtn");

  uploadArea.addEventListener("click", function () {
    fileInput.click();
  });
  fileInput.addEventListener("change", function (e) {
    handleFileArray(Array.from(e.target.files));
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach(function (eventName) {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach(function (eventName) {
    uploadArea.addEventListener(
      eventName,
      function () {
        uploadArea.classList.add("drag-over");
      },
      false
    );
  });

  ["dragleave", "drop"].forEach(function (eventName) {
    uploadArea.addEventListener(
      eventName,
      function () {
        uploadArea.classList.remove("drag-over");
      },
      false
    );
  });

  uploadArea.addEventListener(
    "drop",
    function (e) {
      handleFileArray(Array.from(e.dataTransfer.files));
    },
    false
  );

  function handleFileArray(files) {
    files.forEach(function (file) {
      if (file.size > maxFileSize) {
        alert(
          `Die Datei "${file.name}" ist zu groß. Die maximale Dateigröße beträgt ${config.upload.maxFileSizeMB} MB.`
        );
        return;
      }
      if (
        uploadedFiles.some(function (f) {
          return f.name === file.name;
        })
      ) {
        return;
      }
      // If there are already completed files in the list, clear them out
      if (document.querySelector(".status-success, .status-error")) {
        resetUI();
      }
      // Don't add files if the process is "done" and waiting for a reset
      if (document.getElementById("reset-upload-btn").style.display !== "none") {
        return;
      }
      uploadedFiles.push(file);
      addFileToTable(file);
    });
    updateUI();
  }

  function addFileToTable(file) {
    var row = fileTableBody.insertRow();
    row.setAttribute("data-filename", file.name);

    row.innerHTML =
      "<td>" +
      file.name +
      "</td>" +
      "<td>" +
      formatFileSize(file.size) +
      "</td>" +
      "<td><button onclick=\"removeFile(this, '" +
      file.name +
      "')\">Entfernen</button></td>" +
      '<td class="status-cell">bereit zum versenden</td>';
  }

  function removeFile(buttonElement, fileName) {
    uploadedFiles = uploadedFiles.filter(function (file) {
      return file.name !== fileName;
    });
    buttonElement.closest("tr").remove();
    updateUI();
  }

  function updateUI() {
    var hasFiles = uploadedFiles.length > 0;
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
    var k = 1024;
    var sizes = ["Bytes", "KB", "MB", "GB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  sendBtn.addEventListener("click", async function () {
    if (sendBtn.disabled) return;

    sendBtn.disabled = true;
    sendBtn.textContent = "Am hochladen...";
    document.getElementById("upload-heading").classList.add("disabled");

    var removeButtons = document.querySelectorAll("#fileListTable button");
    removeButtons.forEach(function (button) {
      button.disabled = true;
    });

    var uploadPromises = uploadedFiles.map(function (file) {
      var row = fileTableBody.querySelector('[data-filename="' + file.name + '"]');
      var statusCell = row.cells[3];
      statusCell.innerHTML = '<div class="spinner"></div>';

      var formData = new FormData();
      formData.append("file", file);

      return fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          if (response.ok) {
            statusCell.innerHTML = '<span class="status-success">versandt</span>';
          } else {
            statusCell.innerHTML = '<span class="status-error">✗ Fehlgeschlagen</span>';
          }
          return response;
        })
        .catch(function (error) {
          console.error("Upload error for " + file.name, error);
          statusCell.innerHTML = '<span class="status-error">✗ Netzwerkfehler</span>';
          return { ok: false };
        });
    });

    try {
      const results = await Promise.all(uploadPromises);
      const allOk = results.every(function (res) {
        return res.ok;
      });

      if (allOk) {
        sendBtn.textContent = "Dateien erfolgreich versandt";
        document.getElementById("reset-upload-btn").style.display = "block";
        // Visually disable the upload area now that the process is complete
        document.getElementById("uploadArea").classList.add("disabled");
        document.getElementById("browseBtn").disabled = true;
      } else {
        sendBtn.textContent = "Fehler";
        sendBtn.disabled = false; // Re-enable to allow retry
        document.getElementById("upload-heading").classList.remove("disabled");
        alert(
          "Einige Dateien konnten nicht hochgeladen werden. Bitte überprüfen Sie die Statusanzeige und versuchen Sie es erneut."
        );
      }
    } catch (error) {
      console.error("Upload error", error);
      sendBtn.textContent = "Fehler";
      sendBtn.disabled = false; // Re-enable to allow retry
      document.getElementById("upload-heading").classList.remove("disabled");
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    }
  });

  document.getElementById("reset-upload-btn").addEventListener("click", function (event) {
    event.preventDefault();
    resetUI();
  });
});
