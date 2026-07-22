"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  DEFAULT_TICKET_TYPE,
  TICKET_TYPES,
  bookingTotal,
  formatSeatList,
  ticketPrice,
  ticketTypeLabel,
  type SeatId,
  type SeatTicketMap,
  type TicketTypeId,
} from "@/lib/seating";
import { posterUrl } from "@/lib/movies";
import SeatMap from "./SeatMap";
import styles from "./BookingFlow.module.css";

export interface BookingMovie {
  id: number;
  title: string;
  poster_path: string | null;
  runtimeLabel: string;
}

interface BookingFlowProps {
  movie: BookingMovie;
  date: string;
  dateLabel: string;
  time: string;
  occupied: SeatId[];
}

type Step = "seats" | "checkout" | "done";

export default function BookingFlow({
  movie,
  date,
  dateLabel,
  time,
  occupied,
}: BookingFlowProps) {
  const occupiedSet = useMemo(() => new Set(occupied), [occupied]);
  const [selected, setSelected] = useState<SeatId[]>([]);
  const [ticketTypes, setTicketTypes] = useState<SeatTicketMap>({});
  const [step, setStep] = useState<Step>("seats");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const total = bookingTotal(selected, ticketTypes);
  const poster = posterUrl(movie.poster_path, "w342");
  const sortedSeats = useMemo(() => [...selected].sort(), [selected]);

  const toggleSeat = (id: SeatId) => {
    if (occupiedSet.has(id)) return;
    setSelected((prev) => {
      if (prev.includes(id)) {
        setTicketTypes((types) => {
          const next = { ...types };
          delete next[id];
          return next;
        });
        return prev.filter((s) => s !== id);
      }
      setTicketTypes((types) => ({
        ...types,
        [id]: types[id] ?? DEFAULT_TICKET_TYPE,
      }));
      return [...prev, id];
    });
  };

  const setSeatType = (seat: SeatId, type: TicketTypeId) => {
    setTicketTypes((prev) => ({ ...prev, [seat]: type }));
  };

  const goCheckout = () => {
    if (!selected.length) return;
    setTicketTypes((prev) => {
      const next = { ...prev };
      for (const seat of selected) {
        if (!next[seat]) next[seat] = DEFAULT_TICKET_TYPE;
      }
      return next;
    });
    setStep("checkout");
  };

  const onConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (!selected.length || !name.trim() || !email.trim()) return;
    const missing = selected.some((s) => !ticketTypes[s]);
    if (missing) return;
    setStep("done");
  };

  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <Link href={`/movies/${movie.id}`} className={styles.back}>
          ← Back to film
        </Link>

        <header className={styles.header}>
          {poster ? (
            <div
              className={styles.poster}
              style={{ backgroundImage: `url(${poster})` }}
              role="img"
              aria-label={movie.title}
            />
          ) : null}
          <div>
            <p className={styles.kicker}>Booking</p>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.meta}>
              {dateLabel} · {time}
              {movie.runtimeLabel ? ` · ${movie.runtimeLabel}` : ""}
            </p>
          </div>
        </header>

        <div className={styles.steps}>
          <span className={step === "seats" ? styles.stepActive : ""}>
            1. Seats
          </span>
          <span className={styles.stepSep}>/</span>
          <span className={step === "checkout" ? styles.stepActive : ""}>
            2. Checkout
          </span>
          <span className={styles.stepSep}>/</span>
          <span className={step === "done" ? styles.stepActive : ""}>
            3. Confirmed
          </span>
        </div>

        {step === "seats" ? (
          <section className={styles.panel}>
            <div className={styles.screen} aria-hidden>
              Screen
            </div>

            <div className={styles.legend}>
              <span>
                <i className={`${styles.swatch} ${styles.free}`} /> Available
              </span>
              <span>
                <i className={`${styles.swatch} ${styles.picked}`} /> Selected
              </span>
              <span>
                <i className={`${styles.swatch} ${styles.taken}`} /> Taken
              </span>
            </div>

            <SeatMap
              occupied={occupiedSet}
              selected={selected}
              onToggle={toggleSeat}
            />

            <div className={styles.summaryBar}>
              <div>
                <p className={styles.summaryLabel}>
                  {selected.length
                    ? `${selected.length} seat${selected.length > 1 ? "s" : ""} · ${formatSeatList(selected)}`
                    : "Select one or more seats"}
                </p>
                <p className={styles.summaryTotal}>
                  from €{(selected.length * ticketPrice("child")).toFixed(2)}
                  <span className={styles.summaryNote}>
                    {" "}
                    · ticket type chosen at checkout
                  </span>
                </p>
              </div>
              <button
                type="button"
                className={styles.primary}
                disabled={!selected.length}
                onClick={goCheckout}
              >
                Continue to checkout
              </button>
            </div>
          </section>
        ) : null}

        {step === "checkout" ? (
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Checkout</h2>
            <div className={styles.checkoutGrid}>
              <aside className={styles.order}>
                <h3 className={styles.orderTitle}>Your order</h3>
                <dl className={styles.orderList}>
                  <div>
                    <dt>Film</dt>
                    <dd>{movie.title}</dd>
                  </div>
                  <div>
                    <dt>When</dt>
                    <dd>
                      {dateLabel} · {time}
                    </dd>
                  </div>
                  <div>
                    <dt>Seats</dt>
                    <dd>{formatSeatList(selected)}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd className={styles.orderTotal}>€{total.toFixed(2)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={() => setStep("seats")}
                >
                  Change seats
                </button>
              </aside>

              <form className={styles.form} onSubmit={onConfirm}>
                <fieldset className={styles.ticketFieldset}>
                  <legend className={styles.ticketLegend}>
                    Ticket type per seat
                  </legend>
                  <p className={styles.ticketHint}>
                    Adult €{ticketPrice("adult")} · Child €
                    {ticketPrice("child")} · Elderly €
                    {ticketPrice("elderly")}
                  </p>
                  <div className={styles.ticketList}>
                    {sortedSeats.map((seat) => {
                      const type = ticketTypes[seat] ?? DEFAULT_TICKET_TYPE;
                      return (
                        <label key={seat} className={styles.ticketRow}>
                          <span className={styles.ticketSeat}>{seat}</span>
                          <select
                            required
                            value={type}
                            onChange={(e) =>
                              setSeatType(
                                seat,
                                e.target.value as TicketTypeId
                              )
                            }
                            className={styles.select}
                            aria-label={`Ticket type for seat ${seat}`}
                          >
                            {TICKET_TYPES.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.label} — €{t.price}
                              </option>
                            ))}
                          </select>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <label className={styles.field}>
                  <span>Full name</span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    placeholder="Your name"
                  />
                </label>
                <label className={styles.field}>
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="you@email.com"
                  />
                </label>
                <p className={styles.formNote}>
                  This is a demo checkout — no payment is processed.
                </p>
                <button type="submit" className={styles.primary}>
                  Confirm booking · €{total.toFixed(2)}
                </button>
              </form>
            </div>
          </section>
        ) : null}

        {step === "done" ? (
          <section className={styles.panel}>
            <div className={styles.done}>
              <p className={styles.doneKicker}>You’re booked</p>
              <h2 className={styles.panelTitle}>See you at the cinema</h2>
              <p className={styles.doneBody}>
                {name}, your tickets for <strong>{movie.title}</strong> on{" "}
                {dateLabel} at {time} are confirmed.
              </p>
              <ul className={styles.doneTicketList}>
                {sortedSeats.map((seat) => {
                  const type = ticketTypes[seat] ?? DEFAULT_TICKET_TYPE;
                  return (
                    <li key={seat}>
                      Seat {seat} · {ticketTypeLabel(type)} · €
                      {ticketPrice(type).toFixed(2)}
                    </li>
                  );
                })}
              </ul>
              <p className={styles.doneSeats}>Total €{total.toFixed(2)}</p>
              <p className={styles.formNote}>
                A confirmation would be sent to {email}.
              </p>
              <div className={styles.doneActions}>
                <Link href={`/movies/${movie.id}`} className={styles.secondary}>
                  Back to film
                </Link>
                <Link href="/" className={styles.primary}>
                  Home
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <span hidden>{date}</span>
      </div>
    </main>
  );
}
