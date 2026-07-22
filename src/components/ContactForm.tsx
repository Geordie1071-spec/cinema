"use client";

import { useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/contact";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.heading}>{CONTACT.heading}</h1>
        <p className={styles.intro}>{CONTACT.intro}</p>

        {sent ? (
          <p className={styles.success} role="status">
            Thanks — your message is ready to send. We&apos;ll get back to you
            soon.
          </p>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.field}>
              <span className={styles.srOnly}>Name</span>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.srOnly}>Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@email.com"
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.srOnly}>Subject</span>
              <input
                name="subject"
                type="text"
                required
                placeholder="Subject of your message"
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.srOnly}>Message</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Your message..."
                className={`${styles.input} ${styles.textarea}`}
              />
            </label>

            <label className={styles.consent}>
              <input type="checkbox" name="consent" required />
              <span>{CONTACT.consent}</span>
            </label>

            <button type="submit" className={styles.submit}>
              {CONTACT.submitLabel}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
