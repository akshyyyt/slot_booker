
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm}`;
}


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

export function createBookingEngine(options = {}) {
  const open = options.open || "09:00";
  const close = options.close || "17:00";
  const slotMinutes = options.slotMinutes || 60;

  const resources = [];
  const bookings = [];

  return {
    addResource(id, name) {
      const alreadyExists = resources.find((r) => r.id === id);
      if (alreadyExists) {
        return { ok: false, message: "Resource already exists." };
      }

      resources.push({ id, name });
      return { ok: true };
    },

    listResources() {
      return resources;
    },

    listSlots(resourceId, date) {
      const resource = resources.find((r) => r.id === resourceId);
      if (!resource) {
        return { ok: false, message: "Resource not found." };
      }

      const baseSlots = generateDailySlots(open, close, slotMinutes);

      const slotsWithStatus = baseSlots.map((slot) => {
        const existingBooking = bookings.find(
          (b) => b.resourceId === resourceId && b.date === date && b.start === slot.start
        );

        return {
          start: slot.start,
          end: slot.end,
          taken: Boolean(existingBooking),
          booking: existingBooking || null,
        };
      });

      return {
        ok: true,
        resource,
        slots: slotsWithStatus,
      };
    },

    book(info) {
      const { resourceId, date, start, name, userId } = info;

      if (!resourceId || !date || !start || !name || !userId) {
        return {
          ok: false,
          message: "All fields are required (resourceId, date, start, name, userId).",
        };
      }

      const resource = resources.find((r) => r.id === resourceId);
      if (!resource) {
        return { ok: false, message: "Resource not found." };
      }

      const validSlots = generateDailySlots(open, close, slotMinutes);
      const matchedSlot = validSlots.find((s) => s.start === start);
      if (!matchedSlot) {
        return { ok: false, message: "That start time is not a real slot." };
      }

      const isAlreadyBooked = bookings.some(
        (b) => b.resourceId === resourceId && b.date === date && b.start === start
      );
      if (isAlreadyBooked) {
        return { ok: false, message: "That slot is already booked." };
      }

      const newBooking = {
        id: "book_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        resourceId,
        date,
        start: matchedSlot.start,
        end: matchedSlot.end,
        name,
        userId,
      };

      bookings.push(newBooking);
      return { ok: true, booking: newBooking };
    },

    cancel(bookingId) {
      const index = bookings.findIndex((b) => b.id === bookingId);
      if (index === -1) {
        return { ok: false, message: "Booking not found." };
      }

      const [removedBooking] = bookings.splice(index, 1);
      return { ok: true, booking: removedBooking };
    },
  };
}
