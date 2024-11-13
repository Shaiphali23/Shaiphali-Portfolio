document.addEventListener("DOMContentLoaded", () => {
  //hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const menuItem = document.querySelector(".nav-menu");
  const menuLinks = document.querySelectorAll(".nav-menu a");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menuItem.classList.toggle("active");
  });

  //close menu after clicking on link
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      menuItem.classList.remove("active");
    });
  });

  //close menu after clicking on anywhere
  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".hamburger") &&
      !event.target.closest(".nav-menu")
    ) {
      hamburger.classList.remove("active");
      menuItem.classList.remove("active");
    }
  });

  //contact form submission
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const numberInput = document.getElementById("number");
  const messageInput = document.getElementById("message");

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = nameInput.value;
    const email = emailInput.value;
    const number = numberInput.value;
    const message = messageInput.value;

    // Check if the number is exactly 10 digits
    if (!/^\d{10}$/.test(number)) {
      Toastify({
        text: "Please enter a valid 10-digit phone number.",
        position: "center",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
      }).showToast();
      return;
    }

    const loadingToast = Toastify({
      text: "Sending your message...",
      duration: -1,
      position: "center",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();

    try {
      //send post request to backend
      const response = await fetch("https://shaiphali-portfolio.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, number, message }),
      });

      //parse response
      const data = await response.json();
      if (data.success) {
        Toastify({
          text: data.message,
          duration: 3000,
          position: "center",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();

        // Clear the form fields after successful submission
        (nameInput.value = ""),
          (emailInput.value = ""),
          (numberInput.value = ""),
          (messageInput.value = "");
      } else {
        Toastify({
          text: data.error,
          duration: 3000,
          position: "center",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
        }).showToast();
      }
    } catch (error) {
      console.log(error.message);
      Toastify({
        text: "An error occurred while sending your message.",
        duration: 3000,
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
      }).showToast();
    } finally {
      loadingToast.hideToast();
    }
  });
});
