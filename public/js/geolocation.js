// *Function to retrieve the user's geolocation.
async function getGeolocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  } else {
    throw new Error("Geolocation is not supported by this browser.");
  }
}

// *Function to fetch events from the server based on latitude and longitude.
async function fetchEvents(latitude, longitude) {
  try {
    const response = await fetch("/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.events;
    } else {
      throw new Error("Failed to fetch events");
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

// *Function to display events on the page.
async function displayEvents() {
  try {
    const { latitude, longitude } = await getGeolocation();
    const events = await fetchEvents(latitude, longitude);

    const eventsContainer = document.getElementById("events-container");
    eventsContainer.innerHTML = "";

    if (events.length === 0) {
      eventsContainer.innerHTML =
        "<p>No events found for the current location.</p>";
    } else {
      const eventList = document.createElement("div");
      eventList.classList.add("event-list");

      events.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");

        const formattedDate = formatDate(event.startDate);
        const formattedTime = formatTime(event.startTime);

        eventCard.innerHTML = `
          <h2>${event.name}</h2>
          <img src="${event.imageUrl}" alt="${event.name} image" style="width: 100%; height: auto;">
          <p>Date: ${formattedDate}</p>
          <p>Time: ${formattedTime}</p>
          <p>Venue: ${event.venue}</p>
          <a href="${event.url}" target="_blank">View Details</a>
          <button class="save-event" data-event-id="${event.id}" data-event-name="${event.name}" data-event-date="${event.startDate}">Save Event</button>
        `;
        eventList.appendChild(eventCard);
      });

      eventsContainer.appendChild(eventList);
    }

    // *Add event listener to save event buttons.
    const saveEventButtons = document.querySelectorAll(".save-event");
    saveEventButtons.forEach((button) => {
      button.addEventListener("click", saveEvent);
    });
  } catch (error) {
    console.error("Error displaying events:", error);
  }
}

// *Helper function to format the date.
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear() + 5;
  return `${month}/${day}/${year}`;
}

// *Helper function to format the time.
function formatTime(timeString) {
  if (!timeString) {
    return "No Time Available";
  }
  const [hours, minutes] = timeString.split(":");
  let hours12 = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  return `${hours12}:${minutes} ${ampm}`;
}

// *Function to save an event.
async function saveEvent(event) {
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
  } catch (error) {
    console.error("Error saving event:", error);
  }
}

// *Event listener to trigger displayEvents when the DOM is loaded.
document.addEventListener("DOMContentLoaded", displayEvents);
