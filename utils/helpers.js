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

  // *Pagination Helpers:
  // *Greater than helper.
  gt: function (a, b) {
    return a > b;
  },

  // *Less than helper.
  lt: function (a, b) {
    return a < b;
  },

  // *Subtraction helper.
  subtract: function (a, b) {
    return a - b;
  },

  // *Equality helper.
  eq: function (a, b) {
    return a === b;
  },

  // *Range helper.
  range: function (start, end) {
    let result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  },

  // *Addition helper.
  add: function (a, b) {
    return a + b;
  },

  // *Maximum helper.
  max: function (a, b) {
    return Math.max(a, b);
  },

  // *Minimum helper.
  min: function (a, b) {
    return Math.min(a, b);
  },
};
