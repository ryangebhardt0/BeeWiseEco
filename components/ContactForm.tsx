'use client';

import { useState } from 'react';

/**
 * Enquiry form.
 *
 * Still presentation-only, exactly as before the rebuild — there is no mail
 * transport wired up yet. The phone number and email address above it are the
 * working channels.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="contact__form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {sent ? (
        <div className="contact__form-success">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🐝</div>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 28, marginBottom: 8 }}>
            Got it. Buzzing back soon.
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
            We&rsquo;ll get back to you promptly.
          </p>
        </div>
      ) : (
        <div className="contact__form-fields">
          <div>
            <label htmlFor="cf-name">Name</label>
            <input id="cf-name" name="name" type="text" placeholder="Your name" required />
          </div>
          <div>
            <label htmlFor="cf-email">Email or phone</label>
            <input
              id="cf-email"
              name="contact"
              type="text"
              placeholder="how should we reply?"
              required
            />
          </div>
          <div>
            <label htmlFor="cf-topic">What&rsquo;s up?</label>
            <select id="cf-topic" name="topic" defaultValue="removal">
              <option value="removal">Bee removal</option>
              <option value="pollination">Pollination booking</option>
              <option value="products">Products &amp; orders</option>
              <option value="equipment">Beekeeping equipment</option>
              <option value="other">Something else</option>
            </select>
          </div>
          <div>
            <label htmlFor="cf-msg">Tell us more</label>
            <textarea
              id="cf-msg"
              name="message"
              rows={3}
              placeholder="Where are the bees? When did they show up?"
            />
          </div>
          <button type="submit" className="btn honey" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
            Send it →
          </button>
        </div>
      )}
    </form>
  );
}
