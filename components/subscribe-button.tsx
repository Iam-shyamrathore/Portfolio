"use client";

import { useId, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";

export function SubscribeButton({
  feedUrl,
  className,
}: {
  feedUrl: string;
  className?: string;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const address = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  async function copyFeed() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setStatus("Feed URL copied. Paste it into your RSS reader.");
    } catch {
      address.current?.focus();
      address.current?.select();
      setStatus("Feed URL selected. Copy it using your device’s copy command.");
    }
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        aria-controls={`${id}-dialog`}
      >
        Subscribe to writing
      </button>
      <dialog
        ref={dialog}
        id={`${id}-dialog`}
        className="contact-dialog subscribe-dialog"
        aria-labelledby={`${id}-heading`}
        aria-describedby={`${id}-description`}
        onClose={() => setStatus("")}
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom
          ) event.currentTarget.close();
        }}
      >
        <button
          type="button"
          className="contact-close"
          aria-label="Close subscription panel"
          onClick={() => dialog.current?.close()}
        >
          <X size={18} aria-hidden="true" />
        </button>
        <h2 id={`${id}-heading`}>Subscribe to writing.</h2>
        <p id={`${id}-description`}>
          Get new engineering notes in your RSS reader, a reading app that brings
          updates from the sites you follow into one place.
        </p>
        <ol className="subscribe-steps">
          <li>Copy the feed URL below.</li>
          <li>Open your RSS reader and choose “Add feed” or “Follow a website”.</li>
          <li>Paste the URL and follow. New notes will appear in your reader.</li>
        </ol>
        <label className="contact-address-label" htmlFor={`${id}-url`}>RSS feed URL</label>
        <div className="contact-address">
          <input
            ref={address}
            id={`${id}-url`}
            type="url"
            readOnly
            value={feedUrl}
            spellCheck={false}
            onFocus={(event) => event.currentTarget.select()}
          />
          <button type="button" className="contact-copy" onClick={copyFeed}>
            {status.startsWith("Feed URL copied")
              ? <Check size={16} aria-hidden="true" />
              : <Copy size={16} aria-hidden="true" />}
            Copy feed URL
          </button>
        </div>
        <p className="contact-status" role="status">{status}</p>
        <a className="text-link" href={feedUrl}>
          View raw RSS feed <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </dialog>
    </>
  );
}
