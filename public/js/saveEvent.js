document.querySelectorAll(".save-event").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const eventId = event.target.dataset.id;
    console.log("Event ID:", eventId); // Add this line

    try {
      const response = await fetch("/save-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (response.ok) {
        alert("Event saved successfully!");
      } else {
        alert("Failed to save event.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred while saving the event.");
    }
  });
});
