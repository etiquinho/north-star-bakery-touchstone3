// North Star Bakery — Touchstone 4
// Interactive feature, form validation, and browser storage.

const bakeryProducts = [
  { id: "signature-loaf", name: "Signature Loaf", category: "Bread" },
  { id: "seasonal-pastry", name: "Seasonal Pastry", category: "Pastry" },
  { id: "celebration-cake", name: "Celebration Cake", category: "Cake" },
  { id: "cookie-box", name: "Cookie Box", category: "Treat" }
];

const storageKeys = {
  favorite: "northStarFavorite",
  contact: "northStarContact"
};

const validationMessages = {
  name: "Please enter your name.",
  email: "Please enter a valid email address.",
  pickupDate: "Please choose a pickup date.",
  itemDetails: "Please enter at least 10 characters describing your request."
};

function populateFavoriteOptions() {
  const select = document.querySelector("#favorite-product");
  if (!select) return;

  bakeryProducts.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} — ${product.category}`;
    select.appendChild(option);
  });
}

function getProductById(productId) {
  return bakeryProducts.find((product) => product.id === productId);
}

function renderFavorite(productId, restored = false) {
  const result = document.querySelector("#favorite-result");
  const select = document.querySelector("#favorite-product");
  if (!result || !select) return;

  const product = getProductById(productId);

  if (!product) {
    result.textContent = "Choose an item before saving your favorite.";
    result.classList.remove("saved-value");
    return;
  }

  select.value = product.id;
  result.textContent = restored
    ? `Welcome back! Your saved favorite is ${product.name}.`
    : `${product.name} is now saved as your favorite.`;
  result.classList.add("saved-value");
}

function saveFavorite() {
  const select = document.querySelector("#favorite-product");
  if (!select) return;

  const productId = select.value;
  if (!getProductById(productId)) {
    renderFavorite("");
    return;
  }

  localStorage.setItem(storageKeys.favorite, productId);
  renderFavorite(productId);
}

function loadFavorite() {
  const savedFavorite = localStorage.getItem(storageKeys.favorite);
  if (savedFavorite) {
    renderFavorite(savedFavorite, true);
  }
}

function setFieldError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  if (!error) return;

  error.textContent = message;
  field.classList.add("input-error");
}

function clearFieldError(field) {
  const error = document.querySelector(`#${field.id}-error`);
  if (!error) return;

  error.textContent = "";
  field.classList.remove("input-error");
}

function validateContactForm(form) {
  const name = form.querySelector("#name");
  const email = form.querySelector("#email");
  const pickupDate = form.querySelector("#pickup-date");
  const itemDetails = form.querySelector("#item-details");

  [name, email, pickupDate, itemDetails].forEach(clearFieldError);

  let isValid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.value.trim()) {
    setFieldError(name, validationMessages.name);
    isValid = false;
  }

  if (!emailPattern.test(email.value.trim())) {
    setFieldError(email, validationMessages.email);
    isValid = false;
  }

  if (!pickupDate.value) {
    setFieldError(pickupDate, validationMessages.pickupDate);
    isValid = false;
  }

  if (itemDetails.value.trim().length < 10) {
    setFieldError(itemDetails, validationMessages.itemDetails);
    isValid = false;
  }

  return isValid;
}

function saveContactPreferences(form) {
  const savedContact = {
    name: form.querySelector("#name").value.trim(),
    email: form.querySelector("#email").value.trim()
  };

  localStorage.setItem(storageKeys.contact, JSON.stringify(savedContact));
}

function loadContactPreferences() {
  const form = document.querySelector("form");
  if (!form) return;

  const saved = localStorage.getItem(storageKeys.contact);
  if (!saved) return;

  try {
    const savedContact = JSON.parse(saved);
    if (savedContact.name) form.querySelector("#name").value = savedContact.name;
    if (savedContact.email) form.querySelector("#email").value = savedContact.email;
  } catch (error) {
    localStorage.removeItem(storageKeys.contact);
  }
}

function setupContactForm() {
  const form = document.querySelector("form");
  if (!form) return;

  loadContactPreferences();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const status = document.querySelector("#form-status");

    if (!validateContactForm(form)) {
      if (status) status.textContent = "Please correct the highlighted fields before submitting.";
      return;
    }

    saveContactPreferences(form);

    if (status) {
      status.textContent =
        "Request validated successfully. Your name and email were saved for your next visit.";
      status.classList.add("saved-value");
    }
  });

  ["name", "email", "pickup-date", "item-details"].forEach((id) => {
    const field = form.querySelector(`#${id}`);
    if (field) {
      field.addEventListener("input", () => clearFieldError(field));
      field.addEventListener("change", () => clearFieldError(field));
    }
  });
}

function initializeTouchstone4() {
  populateFavoriteOptions();

  const saveButton = document.querySelector("#save-favorite");
  if (saveButton) {
    saveButton.addEventListener("click", saveFavorite);
    loadFavorite();
  }

  setupContactForm();
}

document.addEventListener("DOMContentLoaded", initializeTouchstone4);
