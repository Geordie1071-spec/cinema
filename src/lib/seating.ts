export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const SEATS_PER_ROW = 12;
export const AISLE_AFTER = 6;
export const TICKET_PRICE_EUR = 8;

export type SeatId = `${(typeof SEAT_ROWS)[number]}${number}`;

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Deterministic “already taken” seats for a screening. */
export function getOccupiedSeats(
  movieId: number,
  date: string,
  time: string
): Set<SeatId> {
  const seed = hashSeed(`${movieId}-${date}-${time}`);
  const taken = new Set<SeatId>();
  const total = SEAT_ROWS.length * SEATS_PER_ROW;
  const count = 8 + (seed % 10);

  for (let i = 0; i < count; i++) {
    const n = (seed * (i + 3) + i * 17) % total;
    const row = SEAT_ROWS[Math.floor(n / SEATS_PER_ROW)];
    const seat = (n % SEATS_PER_ROW) + 1;
    taken.add(`${row}${seat}` as SeatId);
  }

  return taken;
}

export function formatSeatList(seats: string[]) {
  return [...seats].sort().join(", ");
}

export function bookingTotal(seatCount: number) {
  return seatCount * TICKET_PRICE_EUR;
}
