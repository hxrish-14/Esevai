/* =========================================
   ESEVAI FORM LOGIC
========================================= */

const docSel = document.getElementById("documentType");
const serviceSel = document.getElementById("serviceType");
const fileBox = document.getElementById("fileUploads");
const feeBox = document.getElementById("feeAmount");

const paymentModal = document.getElementById("paymentModal");
const successModal = document.getElementById("successModal");
const modalFee = document.getElementById("modalFee");

const form = document.getElementById("serviceForm");

/* =========================================
   PRICING
========================================= */
const pricing = {
  "Aadhaar": { "PVC Apply":150, "Address Correction":150, "Reprint":150 },
  "PAN": { "Apply":200, "Correction":200, "Reprint":200, "Linking":1200 },
  "Voter ID": { "Apply":150, "Correction":150, "Cancel":150 },
  "Driving License": { "Photo Change":650, "Signature Change":650, "Address Change":650 },
  "Ration Card": { "Apply":150, "Changes":150 }
};

/* =========================================
   INPUT REFERENCES
========================================= */
const nameInput = document.getElementById("fullName");
const mobileInput = document.getElementById("mobile");
const emailInput = document.getElementById("email");
const aadhaarInput = document.getElementById("aadhaar");

const nameError = document.getElementById("nameError");
const mobileError = document.getElementById("mobileError");
const emailError = document.getElementById("emailError");
const aadhaarError = document.getElementById("aadhaarError");

/* =========================================
   INPUT LOCKING
========================================= */

// Name → letters only
nameInput?.addEventListener("input", () => {
  nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, "");
});

// Mobile → numbers only, max 10
mobileInput?.addEventListener("input", () => {
  mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
});

// Aadhaar → numbers only, max 12
aadhaarInput?.addEventListener("input", () => {
  aadhaarInput.value = aadhaarInput.value.replace(/\D/g, "").slice(0, 12);
});

/* =========================================
   FIELD VALIDATION (INLINE)
========================================= */
function validateInputs() {
  let valid = true;

  if (nameInput.value.trim() === "") {
    nameError.textContent = "Name Is Required (Letters Only)";
    valid = false;
  } else {
    nameError.textContent = "";
  }

  if (mobileInput.value.length !== 10) {
    mobileError.textContent = "Enter Valid 10 Digit Mobile Number";
    valid = false;
  } else {
    mobileError.textContent = "";
  }

  if (!emailInput.value.includes("@")) {
    emailError.textContent = "Enter A Valid Email Address";
    valid = false;
  } else {
    emailError.textContent = "";
  }

  if (aadhaarInput.value.length !== 12) {
    aadhaarError.textContent = "Aadhaar Must Be 12 Digits";
    valid = false;
  } else {
    aadhaarError.textContent = "";
  }

  return valid;
}

/* =========================================
   DOCUMENT CHANGE
========================================= */
docSel?.addEventListener("change", () => {
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

/* =========================================
   SERVICE CHANGE → FILE FIELDS
========================================= */
serviceSel?.addEventListener("change", () => {
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

    // File size check (10MB)
    input.addEventListener("change", () => {
      if (input.files[0] && input.files[0].size > 10 * 1024 * 1024) {
        input.value = "";
        alert("File Size Must Be Less Than 10MB");
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

/* =========================================
   FORM SUBMIT → PAYMENT MODAL
========================================= */
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateInputs()) return;

  paymentModal.style.display = "flex";
  document.body.classList.add("blur");
});

/* =========================================
   CANCEL PAYMENT
========================================= */
document.getElementById("cancelBtn")?.addEventListener("click", () => {
  paymentModal.style.display = "none";
  document.body.classList.remove("blur");
});

/* =========================================
   PROCEED → SUCCESS POPUP
========================================= */
document.getElementById("proceedBtn")?.addEventListener("click", () => {
  paymentModal.style.display = "none";
  successModal.style.display = "flex";
});

/* =========================================
   SUCCESS OK → RESET + REDIRECT
========================================= */
document.getElementById("successOkBtn")?.addEventListener("click", () => {
  form.reset();
  fileBox.innerHTML = "";
  document.body.classList.remove("blur");
  window.location.href = "index.html";
});
