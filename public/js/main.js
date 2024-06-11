document.addEventListener("DOMContentLoaded", () => {
  const saveEventButtons = document.querySelectorAll(".save-event");
  const removeEventButtons = document.querySelectorAll(".remove-event");
  const logoutButton = document.querySelector("#logout");

  // Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Send the coordinates to the server using an API endpoint
        fetch("/api/geolocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude, longitude }),
        });
      },
      (error) => {
        console.error("Error obtaining geolocation:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }

  saveEventButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const eventId = event.target.dataset.eventId;
      const eventName = event.target.dataset.eventName;
      const eventDate = event.target.dataset.eventDate;

      try {
        const response = await fetch("/save-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId, eventName, eventDate }),
        });

        if (response.ok) {
          event.target.textContent = "Saved";
          event.target.classList.remove("save-event");
          event.target.classList.add("saved-event");
        }
      } catch (err) {
        console.error(err);
      }
    });
  });

  removeEventButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const eventId = event.target.dataset.eventId;

      try {
        const response = await fetch("/saved-events/remove-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId }),
        });

        if (response.ok) {
          event.target.closest(".event-card").remove();
        }
      } catch (err) {
        console.error(err);
      }
    });
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const response = await fetch("/auth/logout", {
          method: "POST",
        });

        if (response.ok) {
          window.location.href = "/";
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
});
