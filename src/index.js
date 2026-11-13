/**
 * Convert time string "09:30" to total minutes (570)
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert total minutes (570) back to time string "09:30"
 */
function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Generate all empty slots between open and close time
 */
function generateDailySlots(openTime, closeTime, slotMinutes) {
  const slots = [];
  let currentMinute = timeToMinutes(openTime);
  const endMinute = timeToMinutes(closeTime);

  while (currentMinute + slotMinutes <= endMinute) {
    const nextMinute = currentMinute + slotMinutes;
    slots.push({
      start: minutesToTime(currentMinute),
      end: minutesToTime(nextMinute),
    });
    currentMinute = nextMinute;
  }

  return slots;
}
