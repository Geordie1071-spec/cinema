"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AISLE_AFTER,
  SEAT_ROWS,
  SEATS_PER_ROW,
  TICKET_PRICE_EUR,
  bookingTotal,
  formatSeatList,
  type SeatId,
} from "@/lib/seating";
import { posterUrl } from "@/lib/movies";
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
  const [step, setStep] = useState<Step>("seats");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const total = bookingTotal(selected.length);
  const poster = posterUrl(movie.poster_path, "w342");

  const toggleSeat = (id: SeatId) => {
    if (occupiedSet.has(id)) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const goCheckout = () => {
    if (!selected.length) return;
    setStep("checkout");
  };

  const onConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (!selected.length || !name.trim() || !email.trim()) return;
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

            <div className={styles.map} role="group" aria-label="Seat map">
              {SEAT_ROWS.map((row) => (
                <div key={row} className={styles.row}>
                  <span className={styles.rowLabel}>{row}</span>
                  <div className={styles.rowSeats}>
                    {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                      const num = i + 1;
                      const id = `${row}${num}` as SeatId;
                      const isTaken = occupiedSet.has(id);
                      const isSelected = selected.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          disabled={isTaken}
                          aria-pressed={isSelected}
                          aria-label={`Seat ${id}${
                            isTaken ? " taken" : isSelected ? " selected" : ""
                          }`}
                          onClick={() => toggleSeat(id)}
                          className={`${styles.seat} ${
                            isTaken
                              ? styles.taken
                              : isSelected
                                ? styles.picked
                                : styles.free
                          } ${num === AISLE_AFTER ? styles.aisleAfter : ""}`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <span className={styles.rowLabel}>{row}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryBar}>
              <div>
                <p className={styles.summaryLabel}>
                  {selected.length
                    ? `${selected.length} seat${selected.length > 1 ? "s" : ""} · ${formatSeatList(selected)}`
                    : "Select one or more seats"}
                </p>
                <p className={styles.summaryTotal}>
                  €{total.toFixed(2)}
                  <span className={styles.summaryNote}>
                    {" "}
                    · €{TICKET_PRICE_EUR} each
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
                  Confirm booking
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
              <p className={styles.doneSeats}>
                Seats {formatSeatList(selected)} · €{total.toFixed(2)}
              </p>
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

        {/* Keep date in DOM for debugging / future API use */}
        <span hidden>{date}</span>
      </div>
    </main>
  );
}
