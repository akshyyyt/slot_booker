# slot-book

[![npm version](https://img.shields.io/npm/v/slot-book.svg)](https://www.npmjs.com/package/slot-book)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple and lightweight npm package to create time slots and manage bookings without any extra dependencies.

Useful for booking computer labs, meeting rooms, library seats, or teacher office hours.

## Installation

```bash
npm install slot-book
```

> Requires Node.js version 18 or above.

## How to use

```javascript
import { createBookingEngine } from "slot-book";

// 1. Create the booking engine
const engine = createBookingEngine({
  open: "09:00",      // opening time
  close: "17:00",     // closing time
  slotMinutes: 60,    // duration of each slot in minutes
});

// 2. Add a lab or room
engine.addResource("lab-1", "Computer Lab 1");

// 3. Check available slots for a date
const result = engine.listSlots("lab-1", "2026-11-20");
console.log(result.slots);

// 4. Book a slot
const booking = engine.book({
  resourceId: "lab-1",
  date: "2026-11-20",
  start: "10:00",
  name: "Akshay",
  userId: "CSE101",
});

console.log(booking);
// If someone tries to book the same slot again, it returns { ok: false, message: "That slot is already booked." }

// 5. Cancel a booking
engine.cancel(booking.booking.id);
```

## Functions

- `addResource(id, name)`: Adds a room or lab to book.
- `listResources()`: Returns the list of all added resources.
- `listSlots(resourceId, date)`: Returns all time slots for that day and whether each slot is free or booked.
- `book({ resourceId, date, start, name, userId })`: Reserves a slot and prevents anyone else from taking it.
- `cancel(bookingId)`: Cancels a reservation by its booking ID.

## Links

- **NPM Package**: [https://www.npmjs.com/package/slot-book](https://www.npmjs.com/package/slot-book)
- **GitHub Repository**: [https://github.com/akshyyyt/slot_booker](https://github.com/akshyyyt/slot_booker)
- **Issue Tracker**: [https://github.com/akshyyyt/slot_booker/issues](https://github.com/akshyyyt/slot_booker/issues)

## License

MIT
