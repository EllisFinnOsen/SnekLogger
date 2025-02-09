// File: src/hooks/useFormattedTime.js
import { useMemo } from "react";
import { parseISO, format } from "date-fns";

/**
 * useFormattedTime extracts and formats the time portion from an ISO timestamp.
 *
 * @param {string} isoString - An ISO timestamp (e.g. "2024-02-08T08:00:00Z")
 * @param {string} formatString - A date-fns time format string. Defaults to "p"
 *                                ("p" produces the locale-specific time, e.g. "8:00 AM").
 * @returns {string} The formatted time string.
 */
export default function useFormattedTime(isoString, formatString = "p") {
  return useMemo(() => {
    if (!isoString) return "";
    try {
      const date = parseISO(isoString);
      return format(date, formatString);
    } catch (error) {
      console.error("Error formatting time:", error);
      return isoString;
    }
  }, [isoString, formatString]);
}
