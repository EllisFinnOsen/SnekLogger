// File: src/hooks/useFormattedDate.js
import { useMemo } from "react";
import { parseISO, format } from "date-fns";

/**
 * Converts an ISO string into a formatted string.
 *
 * @param {string} isoString - The ISO timestamp, e.g. "2024-02-08T08:00:00Z"
 * @param {string} formatString - A date-fns format string. For example:
 *                                - "P" for the local date (e.g. 02/08/2024)
 *                                - "p" for the local time (e.g. 8:00 AM)
 * @returns {string} The formatted date/time string.
 */
export default function useFormattedDate(isoString, formatString = "P") {
  return useMemo(() => {
    if (!isoString) return "";
    try {
      const date = parseISO(isoString);
      return format(date, formatString);
    } catch (error) {
      console.error("Error parsing date:", error);
      return isoString;
    }
  }, [isoString, formatString]);
}
