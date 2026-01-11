const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2oO3IwCaixnOZiLCAGuauytMRxxv4d41EYes8232gnEBxznElcXqz962UeaCX8Rwn_w/exec";

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

/* ==============================
   INPUT LOCKING
============================== */
nameInput.addEventListener("input", () => {
  nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, "");
});

mobileInput.addEventListener("input", () => {
  mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
});

aadhaarInput.addEventListener("input", () => {
  aadhaarInput.value = aadhaarInput.value.replace(/\D/g, "").slice(0, 12);
});

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

  const createFileInput = (labelText, name) => {
    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = "file";
    input.name = name;
    input.required = true;
    input.accept = ".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx";

    fileBox.append(label, input);
  };

  const d = docSel.value;
  const s = serviceSel.value;

  if (d === "Aadhaar") {
    createFileInput("Upload Aadhaar Card", "file1");
  }

  if (d === "PAN" && (s === "Apply" || s === "Correction")) {
    createFileInput("Upload Aadhaar Card", "file1");
    createFileInput("Upload Passport Size Photo", "file2");
    createFileInput("Upload Signature", "file3");
  }

  if (d === "PAN" && (s === "Reprint" || s === "Linking")) {
    createFileInput("Upload Aadhaar Card", "file1");
    createFileInput("Upload PAN Card", "file2");
  }

  if (d === "Driving License") {
    createFileInput("Upload Driving License", "file1");
    createFileInput("Upload Aadhaar Card", "file2");
    createFileInput("Upload Others", "file3");
  }

  if (d === "Ration Card") {
    createFileInput("Upload Photo", "file1");
    createFileInput("Upload Aadhaar Card", "file2");
    createFileInput("Upload Ration Card", "file3");
  }

  if (d === "Voter ID") {
    createFileInput("Upload Aadhaar Card", "file1");
    createFileInput("Upload Photo", "file2");
  }
});

/* ==============================
   FORM SUBMIT → PAYMENT MODAL
============================== */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  paymentModal.style.display = "flex";
});

/* ==============================
   CANCEL PAYMENT
============================== */
document.getElementById("cancelBtn").addEventListener("click", () => {
  paymentModal.style.display = "none";
});

/* ==============================
   PROCEED → SUBMIT VIA FORMDATA
============================== */
document.getElementById("proceedBtn").addEventListener("click", async () => {

  const formData = new FormData();

  formData.append("fullName", nameInput.value);
  formData.append("mobile", mobileInput.value);
  formData.append("email", emailInput.value);
  formData.append("aadhaar", aadhaarInput.value);
  formData.append("documentType", docSel.value);
  formData.append("serviceType", serviceSel.value);
  formData.append("fee", feeBox.textContent);

  const fileInputs = document.querySelectorAll("#fileUploads input[type='file']");
  fileInputs.forEach(input => {
    if (input.files[0]) {
      formData.append(input.name, input.files[0]);
    }
  });

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData
    });

    const text = await response.text();

    if (text.includes("SUCCESS")) {
      paymentModal.style.display = "none";
      successModal.style.display = "flex";
    } else {
      alert("Submission Failed: " + text);
    }

  } catch (error) {
    alert("Submission Failed: " + error.toString());
  }
});

/* ==============================
   SUCCESS OK → RESET + REDIRECT
============================== */
document.getElementById("successOkBtn").addEventListener("click", () => {
  form.reset();
  fileBox.innerHTML = "";
  window.location.href = "index.html";
});
