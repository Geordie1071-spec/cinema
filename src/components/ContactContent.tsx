import { CONTACT } from "@/lib/contact";
import BuyTicketsLink from "./BuyTicketsLink";
import styles from "./ContactContent.module.css";

export default function ContactContent() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <div className={styles.kickerRow}>
          <span>01</span>
          <span className={styles.kickerLine} />
          <span>{CONTACT.kicker}</span>
        </div>
        <h1 className={styles.heading}>{CONTACT.heading}</h1>
        <p className={styles.intro}>{CONTACT.intro}</p>

        <div className={styles.grid}>
          {CONTACT.details.map((block) => (
            <section key={block.label} className={styles.block}>
              <h2 className={styles.blockLabel}>{block.label}</h2>
              <ul className={styles.lines}>
                {block.lines.map((line, i) => {
                  const href =
                    "hrefs" in block ? block.hrefs?.[i] : undefined;
                  return (
                    <li key={line}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.external}
                        >
                          {line}
                        </a>
                      ) : (
                        line
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <BuyTicketsLink className={styles.cta} />
      </div>
    </main>
  );
}
