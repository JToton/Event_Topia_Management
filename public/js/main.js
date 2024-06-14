document.addEventListener("DOMContentLoaded", () => {
  const saveEventButtons = document.querySelectorAll(".save-event");
  const removeEventButtons = document.querySelectorAll(".remove-event");
  const logoutButton = document.querySelector("#logout");

  // *Add click event listeners to all save event .
  saveEventButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const eventId = event.target.dataset.eventId;
      const eventName = event.target.dataset.eventName;
      const eventDate = event.target.dataset.eventDate;

      // ! Debugging log.
      console.log("Event ID:", eventId);
      console.log("Event Name:", eventName);
      console.log("Event Date:", eventDate);

      // *Check if event data is missing.
      if (!eventId || !eventName || !eventDate) {
        // ! Debugging log.
        console.error("Missing event data");
        return;
      }

      try {
        // *Send a request to save the event.
        const response = await fetch("/save-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // *Send event data.
          body: JSON.stringify({ eventId, eventName, eventDate }),
        });

        if (response.ok) {
          // *Update button to indicate the event is saved.
          event.target.textContent = "Saved";
          event.target.classList.remove("save-event");
          event.target.classList.add("saved-event");
        }
      } catch (err) {
        console.error(err);
      }
    });
  });

  // *Add click event listeners to all remove event buttons.
  removeEventButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const eventId = event.target.dataset.eventId;

      try {
        // *Send a request to remove the event.
        const response = await fetch("/saved-events/remove-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // *Send event ID.
          body: JSON.stringify({ eventId }),
        });

        if (response.ok) {
          // *Remove the event card from the DOM.
          event.target.closest(".event-card").remove();
        }
      } catch (err) {
        console.error(err);
      }
    });
  });

  // *Add click event listener to the logout button.
  if (logoutButton) {
    logoutButton.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        // *Send a request to log out the user.
        const response = await fetch("/auth/logout", {
          method: "POST",
        });

        if (response.ok) {
          // *Redirect to the home page on successful logout.
          window.location.href = "/";
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
});
