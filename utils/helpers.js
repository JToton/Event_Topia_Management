// *Helper functions to format date and time.

module.exports = {
  format_time: (time) => {
    if (!time) {
      // *Return an empty string if time is undefined.
      return "No Time Available";
    }
    const [hours, minutes] = time.split(":");
    let hours12 = hours % 12 || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    return `${hours12}:${minutes} ${ampm}`;
  },
  format_date: (date) => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${
      new Date(date).getFullYear() + 5
    }`;
  },
};
