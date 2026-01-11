/* ==========================================================
   ESEVAI SERVICES – FORM LOGIC (FINAL VERSION)
========================================================== */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyx6EcLx9HDsCWm4KDDqWMVWwz4hKZpgs1KqByHmrNyZZnZ6SShydYk1dL0FzdWJfXa/exec";

const docSel = document.getElementById("documentType");
const serviceSel = document.getElementById("serviceType");
const fileBox = document.getElementById("fileUploads");
const feeBox = document.getElementById("feeAmount");

const paymentModal = document.getElementById("paymentModal");
const successModal = document.getElementById("successModal");
const modalFee = document.getElementById("modalFee");

const form = document.getElementById("serviceForm");

/* ==============================
   PRICING
============================== */
const pricing = {
  "Aadhaar": { "PVC Apply":150, "Address Correction":150, "Reprint":150 },
  "PAN": { "Apply":200, "Correction":200, "Reprint":200, "Linking":1200 },
  "Voter ID": { "Apply":150, "Correction":150, "Cancel":150 },
  "Driving License": { "Photo Change":650, "Signature Change":650, "Address Change":650 },
  "Ration Card": { "Apply":150, "Changes":150 }
};

/* ==============================
   INPUT REFERENCES
============================== */
const nameInput = document.getElementById("fullName");
const mobileInput = document.getElementById("mobile");
const emailInput = document.getElementById("email");
const aadhaarInput = document.getElementById("aadhaar");

const nameError = document.getElementById("nameError");
const mobileError = document.getElementById("mobileError");
const emailError = document.getElementById("emailError");
const aadhaarError = document.getElementById("aadhaarError");

/* ==============================
   INPUT LOCKING
============================== */

// Name → letters & space only
nameInput.addEventListener("input", () => {
  nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, "");
});

// Mobile → numbers only (10 digits)
mobileInput.addEventListener("input", () => {
  mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
});

// Aadhaar → numbers only (12 digits)
aadhaarInput.addEventListener("input", () => {
  aadhaarInput.value = aadhaarInput.value.replace(/\D/g, "").slice(0, 12);
});

/* ==============================
   VALIDATION
============================== */
function validateInputs() {
  let valid = true;

  if (!nameInput.value.trim()) {
    nameError.textContent = "Name Is Required (Letters Only)";
    valid = false;
  } else nameError.textContent = "";

  if (mobileInput.value.length !== 10) {
    mobileError.textContent = "Enter Valid 10 Digit Mobile Number";
    valid = false;
  } else mobileError.textContent = "";

  if (!emailInput.value.includes("@")) {
    emailError.textContent = "Enter A Valid Email Address";
    valid = false;
  } else emailError.textContent = "";

  if (aadhaarInput.value.length !== 12) {
    aadhaarError.textContent = "Aadhaar Must Be 12 Digits";
    valid = false;
  } else aadhaarError.textContent = "";

  return valid;
}

/* ==============================
   DOCUMENT CHANGE
============================== */
docSel.addEventListener("change", () => {
  serviceSel.innerHTML = `<option value="">Select Service</option>`;
  fileBox.innerHTML = "";
  feeBox.textContent = "₹0";

  const services = pricing[docSel.value] || {};
  Object.keys(services).forEach(service => {
    const opt = document.createElement("option");
    opt.value = service;
    opt.textContent = `${service} (₹${services[service]})`;
    serviceSel.appendChild(opt);
  });
});

/* ==============================
   SERVICE CHANGE → FILE INPUTS
============================== */
serviceSel.addEventListener("change", () => {
  const fee = pricing[docSel.value][serviceSel.value];
  feeBox.textContent = `₹${fee}`;
  modalFee.textContent = `₹${fee}`;
  fileBox.innerHTML = "";

  const createFileInput = (labelText) => {
    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = "file";
    input.required = true;
    input.accept = ".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx";

    // File size limit: 10MB
    input.addEventListener("change", () => {
      if (input.files[0] && input.files[0].size > 10 * 1024 * 1024) {
        input.value = "";
        showInlineError("File size must be under 10MB.");
      }
    });

    fileBox.append(label, input);
  };

  const d = docSel.value;
  const s = serviceSel.value;

  if (d === "Aadhaar") {
    createFileInput("Upload Aadhaar Card");
  }

  if (d === "PAN" && (s === "Apply" || s === "Correction")) {
    createFileInput("Upload Aadhaar Card");
    createFileInput("Upload Passport Size Photo");
    createFileInput("Upload Signature");
  }

  if (d === "PAN" && (s === "Reprint" || s === "Linking")) {
    createFileInput("Upload Aadhaar Card");
    createFileInput("Upload PAN Card");
  }

  if (d === "Driving License") {
    createFileInput("Upload Driving License");
    createFileInput("Upload Aadhaar Card");
    createFileInput("Upload Others");
  }

  if (d === "Ration Card") {
    createFileInput("Upload Photo");
    createFileInput("Upload Aadhaar Card");
    createFileInput("Upload Ration Card");
  }

  if (d === "Voter ID") {
    createFileInput("Upload Aadhaar Card");
    createFileInput("Upload Photo");
  }
});

/* ==============================
   INLINE ERROR MESSAGE
============================== */
function showInlineError(msg) {
  const err = document.createElement("div");
  err.className = "inline-error";
  err.textContent = msg;
  form.prepend(err);
  setTimeout(() => err.remove(), 3000);
}

/* ==============================
   SEND TO GOOGLE SCRIPT
============================== */
async function sendToGoogleScript(formData) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    return await response.json();
  } catch (error) {
    console.error("Network Error:", error);
    return { status: "error", message: error.toString() };
  }
}

/* ==============================
   FORM SUBMIT → PAYMENT POPUP
============================== */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateInputs()) return;

  paymentModal.style.display = "flex";
  document.body.classList.add("blur");
});

/* ==============================
   CANCEL PAYMENT
============================== */
document.getElementById("cancelBtn").addEventListener("click", () => {
  paymentModal.style.display = "none";
  document.body.classList.remove("blur");
});

/* ==============================
   PROCEED → SEND TO BACKEND
============================== */
document.getElementById("proceedBtn").addEventListener("click", async () => {

  const filesData = [];
  const inputs = document.querySelectorAll("#fileUploads input[type='file']");

  for (let input of inputs) {
    const file = input.files[0];
    if (!file) continue;

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    filesData.push({
      name: file.name,
      type: file.type,
      data: base64
    });
  }

  const payload = {
    fullName: nameInput.value,
    mobile: mobileInput.value,
    email: emailInput.value,
    aadhaar: aadhaarInput.value,
    documentType: docSel.value,
    serviceType: serviceSel.value,
    fee: feeBox.textContent,
    files: filesData
  };

  const result = await sendToGoogleScript(payload);

  if (result.status === "success") {
    paymentModal.style.display = "none";
    successModal.style.display = "flex";
  } else {
    showInlineError("Submission Failed: " + result.message);
  }
});

/* ==============================
   SUCCESS OK → RESET + REDIRECT
============================== */
document.getElementById("successOkBtn").addEventListener("click", () => {
  form.reset();
  fileBox.innerHTML = "";
  document.body.classList.remove("blur");
  window.location.href = "index.html";
});
