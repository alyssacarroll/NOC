(() => {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVOcAqswtmyk_vtsIiOeBy6zwv_jT4pxx_UOBlcsr-n4cxa0PnFluIvTP_E9yXk3nCB-SLWi_cOSiW/pub?output=csv";
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxuQKu1YOgZvkhwhnOTdqAEnUMFCm7SkKziz6iqAU3YF4eyjHKglIONFgYLkMFo6X6-Tw/exec";

  // ------- Utilities --------
  function formatDate(date = new Date()) {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function fetchJson(url, options) {
    return fetch(url, options).then(res => res.json());
  }

  // -------- USER NAME HANDLING ---------
  function loadUserName() {
    const savedDate = localStorage.getItem("nocUserDate");
    const todayStr = new Date().toLocaleDateString();

    if (savedDate !== todayStr) {
      localStorage.removeItem("nocUserName");
      localStorage.setItem("nocUserDate", todayStr);
      setUserNameDisplay("Operator");
    } else {
      setUserNameDisplay(localStorage.getItem("nocUserName") || "Operator");
    }
  }

  function setUserNameDisplay(name) {
    document.getElementById("userName").textContent = name;
  }

  function promptUserNameChange() {
    const current = document.getElementById("userName").textContent;
    const name = prompt("Enter your name:", current);
    if (name) {
      const trimmed = name.trim();
      localStorage.setItem("nocUserName", trimmed);
      localStorage.setItem("nocUserDate", new Date().toLocaleDateString());
      setUserNameDisplay(trimmed);
      submitOperatorAndDate();
    }
  }

  // ------ Tile Status Updates ------
  function clearTileStatusClasses(tile) {
    tile.classList.remove('true', 'false', 'bad', 'warning', 'on-hold');
  }
  function updateSingleTileStatus(tileId, csvRows) {
    const tile = document.getElementById(tileId);
    if (!tile) return;

    const holdKey = `onHold_${tileId}`;
    const isOnHold = localStorage.getItem(holdKey) === "true";
    const statusDiv = tile.querySelector(".tile-status");

    clearTileStatusClasses(tile);

    if (isOnHold) {
      tile.classList.add("on-hold");
      if (statusDiv) statusDiv.textContent = "Status: On Hold";
      return;
    }
    // Use provided CSV rows to avoid fetching
    const row = csvRows.find(r => r.split(",")[0] === tileId.padStart(2, "0"));
    if (row) {
      const [checkNum, statusRaw, notes, timestamp] = row.split(",");
      const status = statusRaw?.trim().toLowerCase();

      if (status) tile.classList.add(status);
      let statusName = "N/A";
      if (status === "true") statusName = "Complete";
      else if (status === "false") statusName = "Incomplete";
      else if (status === "warning") statusName = "Warning";
      else if (status === "bad") statusName = "Error";
      if (statusDiv) statusDiv.textContent = `Status: ${statusName}`;
    }
  }

  function updateTileStatuses() {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.trim().split('\n').slice(1); // Skip header
        rows.forEach(row => {
          const [checkNum, statusRaw, notes, timestamp] = row.split(",");
          const tileId = checkNum.padStart(2, "0");
          updateSingleTileStatus(tileId, rows); // Pass rows to avoid refetching
        });
      })
      .catch(console.error);
  }

  // ------- Display Current Date -----
  function displayCurrentDate() {
    document.getElementById('currentDate').textContent = formatDate();
  }

  // ------- Submit Operator + Date -------
  async function submitOperatorAndDate() {
    const name = localStorage.getItem("nocUserName") || "Unknown";
    const date = new Date().toLocaleDateString();

    const payload = {
      checkNumber: "operator-header",
      operator: name,
      date: date
    };

    try {
      const result = await fetchJson(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (result.status !== "success") {
        console.error("Failed to set operator/date:", result.message);
      }
    } catch (err) {
      console.error("Error submitting operator/date:", err);
    }
  }

  // --------- Modal Handlers ---------
  function openModal(checkNum, title) {
    const modal = document.getElementById('formModal');
    const modalTitle = document.getElementById('modalTitle');
    const formContent = document.getElementById('formContent');
    const backdrop = document.getElementById('modalBackdrop');

    modalTitle.textContent = `Check ${checkNum}: ${title}`;
    formContent.innerHTML = formTemplates[checkNum] || `<p>Form for check ${checkNum} not available.</p>`;

    modal.classList.remove('wave-server-popup');
    if (checkNum === '10') {
      modal.classList.add('wave-server-popup');
    }

    modal.style.display = 'block';
    backdrop.style.display = 'block';

    const form = document.getElementById('modalForm');
    form.reset();

    // Setup On Hold toggle *after* form reset to preserve state
    const onHoldToggle = document.getElementById("onHoldToggle");
    const onHoldLabel = document.getElementById("onHoldLabel");
    const holdKey = `onHold_${checkNum}`;
    const isOnHold = localStorage.getItem(holdKey) === "true";

    // Explicitly set checked state and attributes
    if (onHoldToggle) {
      onHoldToggle.checked = isOnHold;
      onHoldToggle.setAttribute('checked', isOnHold ? 'checked' : '');
      onHoldLabel.style.color = isOnHold ? "black" : "lightgray";
      console.log(`Opening modal for Check ${checkNum}: onHold=${isOnHold}, checked=${onHoldToggle.checked}`);
    } else {
      console.error(`onHoldToggle not found for Check ${checkNum}`);
    }

    // Sync toggle state with tile and storage
    if (onHoldToggle) {
      onHoldToggle.onchange = () => {
        const newHoldState = onHoldToggle.checked;
        localStorage.setItem(holdKey, newHoldState);
        onHoldLabel.style.color = newHoldState ? "black" : "lightgray";
        updateSingleTileStatus(checkNum.padStart(2, "0"), []); // Pass empty rows for on-hold update
        console.log(`Toggle changed for Check ${checkNum}: onHold=${newHoldState}`);
      };
    }

    document.getElementById('message').textContent = '';
  }

  function closeModal() {
    document.getElementById('formModal').style.display = 'none';
    document.getElementById('modalBackdrop').style.display = 'none';
    updateTileStatuses(); // Refresh all tiles after closing modal
  }

  // ------ Form Submission ---------
  async function handleFormSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('message');
    const submitButton = e.target.querySelector('.submit');

    messageDiv.textContent = 'Submitting...';
    messageDiv.style.backgroundColor = 'beige';
    messageDiv.style.color = 'black';
    submitButton.disabled = true;

    try {
      const formData = new FormData(e.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj['checkNumberStr'] = formDataObj['checkNumber'];

      const serverKeys = [
        "Fly-216N",
        "Fly-220",
        "Fly-222",
        "Fly-224",
        "Fly-226",
        "Fly-228",
        "Fly-230",
        "Fly-232",
        "Fly-234",
        "Fly-236",
        "Fly-238",
        "Fly-240",
        "Fly-242",
        "MED to VPI",
        "SA14WAVE511MS",
        "WAVE-PRXY12019.ptbportal.us",
        "WAVE-PRXY22019.ptbportal.us",
        "WAVE-MANMED2019.ptbportal.us",
        "EASTERN EUROPE Vocality"
      ];

      // Invert slider values for WAVE check (check 10)
      if (formDataObj.checkNumber === "10") {
        for (const key of serverKeys) {
          const isChecked = formData.has(key);
          formDataObj[key] = isChecked ? "offline" : "online";
        }
        formDataObj['Completed'] = 'TRUE';
      }

      // Inject operator info
      formDataObj["Operator"] = localStorage.getItem("nocUserName") || "Unknown";
      formDataObj["Operator Date"] = localStorage.getItem("nocUserDate") || new Date().toLocaleDateString();

      if (!formData.has('Completed')) {
        formDataObj['Completed'] = 'FALSE';
      }

      // Message checks are marked completed if all 4 numbers are entered
      if (
        formData.has('Total Device Count') &&
        formData.has('Raw Messages') &&
        formData.has('Unique IMEIs') &&
        formData.has('Free Disk Space')
      ) {
        formDataObj['Completed'] = 'TRUE';
        formDataObj['Notes'] = formDataObj['Total Device Count'] + ", " + formDataObj['Raw Messages'] + ", " + formDataObj['Unique IMEIs'] + ", " + formDataObj['Free Disk Space'];
      }

      if (formDataObj['checkNumber'] === '10') {
        formDataObj['Completed'] = 'TRUE';
      }

      formDataObj['Timestamp'] = new Date().toLocaleString();

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(formDataObj)
      });

      const data = await response.json();

      if (data.status === 'success') {
        messageDiv.textContent = data.message || 'Data submitted successfully!';
        messageDiv.style.backgroundColor = '#48c78e';
        messageDiv.style.color = 'white';
        e.target.reset();
        setTimeout(() => {
          closeModal();
          updateTileStatuses();
        }, 500);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      messageDiv.textContent = 'Error: ' + error.message;
      messageDiv.style.backgroundColor = '#f14668';
      messageDiv.style.color = 'white';
    } finally {
      submitButton.disabled = false;
      setTimeout(() => (messageDiv.textContent = ''), 4000);
    }
  }

  function toggleMessageSheetBox() {
    const box = document.getElementById("messageSheetBox");
    const button = document.getElementById("messageSheetBtn");

    const isVisible = box.style.display === "block";
    box.style.display = isVisible ? "none" : "block";

    // Optional: update button label or color
    button.textContent = isVisible
      ? "Message Metrics Spreadsheet"
      : "Hide Spreadsheet Upload";

    button.classList.toggle("is-warning", isVisible);
    button.classList.toggle("is-danger", !isVisible);
  }

  function submitSpreadsheetUrl() {
  const input = document.getElementById("spreadsheetUrlInput");
  const url = input.value.trim();

  if (!url) {
    alert("Please enter a URL.");
    return;
  }

  localStorage.setItem("messageSpreadsheetUrl", url);
  alert("URL saved!");
}




  // -------- Initialization --------
  document.addEventListener("DOMContentLoaded", () => {
    fetch('modal.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById('modalContainer').innerHTML = html;
        document.getElementById('modalForm').addEventListener('submit', handleFormSubmit);
      });

    loadUserName();
    displayCurrentDate();
    updateTileStatuses();

    document.getElementById("userNameDisplay").addEventListener("click", promptUserNameChange);
  });

  // Expose to global (if needed)
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.toggleMessageSheetBox = toggleMessageSheetBox;
})();