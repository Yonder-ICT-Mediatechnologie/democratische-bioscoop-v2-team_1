const profileStorageKey = "pandaCinemaAccountProfile";
const messageStorageKey = "pandaCinemaContactMessages";

const form = document.querySelector("[data-contact-form]");
const feedback = document.querySelector("[data-contact-feedback]");

function getStoredProfile() {
  try {
    const raw = window.localStorage.getItem(profileStorageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function prefillFromProfile() {
  const profile = getStoredProfile();
  const nameParts = [profile.firstName, profile.lastName].filter(Boolean);
  const fullName = nameParts.join(" ").trim();

  if (fullName) {
    form.elements.name.value = fullName;
  }

  if (profile.email) {
    form.elements.email.value = profile.email;
  }
}

function storeMessage(message) {
  try {
    const raw = window.localStorage.getItem(messageStorageKey);
    const current = raw ? JSON.parse(raw) : [];
    const messages = Array.isArray(current) ? current : [];
    const nextMessages = [message, ...messages].slice(0, 10);
    window.localStorage.setItem(messageStorageKey, JSON.stringify(nextMessages));
  } catch (error) {
    return;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    id: `contact-${Date.now()}`,
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    subject: form.elements.subject.value.trim(),
    message: form.elements.message.value.trim(),
    createdAt: new Date().toISOString(),
  };

  storeMessage(payload);
  feedback.textContent = "Bericht verzonden. We nemen zo snel mogelijk contact met je op.";

  form.elements.subject.value = "";
  form.elements.message.value = "";
});

prefillFromProfile();
