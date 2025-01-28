// utils/dateUtils.js

/**
 * Convert a 12-hour format time string (e.g., "12:00 PM")
 * into a 24-hour format string (e.g., "12:00:00").
 */
export function convertTo24HourFormat(time) {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
  
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
  
    return `${hours}:${minutes}:00`;
  }
  
  /**
   * Given a date string (YYYY-MM-DD) and a 12-hour time string (e.g. "12:00 PM"),
   * combine into a single Date object in local time.
   * Returns null if invalid.
   */
  export function toISODateTime(dateStr, timeStr) {
    const isoString = `${dateStr}T${convertTo24HourFormat(timeStr)}`;
    const dateObj = new Date(isoString);
  
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    return dateObj;
  }
  
  /**
   * Return only the upcoming feedings (including today)
   * sorted by ascending date/time.
   */
  export function getUpcomingFeedings(feedings) {
    const now = new Date();
  
    const upcoming = feedings.filter((feeding) => {
      const dateObj = toISODateTime(feeding.date, feeding.time);
      return dateObj && dateObj >= now;
    });
  
    upcoming.sort((a, b) => {
      const dateA = toISODateTime(a.date, a.time);
      const dateB = toISODateTime(b.date, b.time);
      return dateA - dateB;
    });
  
    return upcoming;
  }
  
  /* ----------------------------------------------------------------------- */
  /* NEW: Date and Time Formatting Helpers */
  /* ----------------------------------------------------------------------- */
  
  /**
   * Return a date as a string in different styles.
   *
   * @param {Date} date - A JavaScript Date object
   * @param {string} formatType - "DD/MM", "DD/MM/YY", "LONG", etc.
   * @returns {string}
   *
   * Examples:
   *   formatDateString(new Date("2025-02-01"), "DD/MM")    -> "01/02"
   *   formatDateString(new Date("2025-02-01"), "DD/MM/YY") -> "01/02/25"
   *   formatDateString(new Date("2025-02-01"), "LONG")     -> "February 1st"
   */
  export function formatDateString(date, formatType = 'DD/MM/YYYY') {
    if (!(date instanceof Date) || isNaN(date)) return '';
  
    // Get day, month, year
    const day = date.getDate();
    const monthIndex = date.getMonth(); // 0-based
    const year = date.getFullYear();
  
    // Optional: zero-pad day/month for numeric formats
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = monthIndex + 1 < 10 ? `0${monthIndex + 1}` : `${monthIndex + 1}`;
  
    // For "February 1st" style
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Helper to get "st", "nd", "rd", "th"
    function getOrdinalSuffix(d) {
      // special case for 11th, 12th, 13th
      if (d > 10 && d < 14) return 'th';
      const lastDigit = d % 10;
      switch (lastDigit) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    }
  
    switch (formatType) {
      case 'DD/MM':
        return `${dayStr}/${monthStr}`;
      case 'DD/MM/YY':
        // get last 2 digits of year
        const shortYear = year.toString().slice(-2);
        return `${dayStr}/${monthStr}/${shortYear}`;
      case 'LONG':
        // e.g. "February 1st"
        return `${monthNames[monthIndex]} ${day}${getOrdinalSuffix(day)}`;
      case 'DD/MM/YYYY':
      default:
        return `${dayStr}/${monthStr}/${year}`;
    }
  }
  
  /**
   * Format time as "hh:mm AM/PM" from a Date object
   */
  export function formatTimeString(date) {
    if (!(date instanceof Date) || isNaN(date)) return '';
  
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    // Convert 24hr to 12hr
    hours = hours % 12 || 12;
  
    // Zero-pad minutes if needed
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${hours}:${minutesStr} ${ampm}`;
  }
  
  /**
   * Format time as "HH:mm" (24-hour format) from a Date object
   */
  export function formatTimeString24Hr(date) {
    if (!(date instanceof Date) || isNaN(date)) return '';
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const hoursStr = hours < 10 ? `0${hours}` : hours;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${hoursStr}:${minutesStr}`;
  }
  