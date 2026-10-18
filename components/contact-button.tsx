"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";

const email = "shyamrathore013@gmail.com";
const gmail = `https://mail.google.com/mail/?${new URLSearchParams({view:"cm",fs:"1",to:email})}`;

export function ContactButton() {
  const dialog=useRef<HTMLDialogElement>(null), address=useRef<HTMLInputElement>(null);
  const [status,setStatus]=useState("");
  async function copyEmail(){
    try{
      await navigator.clipboard.writeText(email);
      setStatus("Email copied.");
    }catch{
      address.current?.focus();address.current?.select();
      setStatus("Address selected. Press ⌘C or Ctrl+C to copy.");
    }
  }
  return <>
    <button className="header-contact" onClick={()=>dialog.current?.showModal()} aria-haspopup="dialog" aria-controls="contact-dialog">
      Say hello <ArrowUpRight size={14} aria-hidden="true"/>
    </button>
    <dialog ref={dialog} id="contact-dialog" className="contact-dialog" aria-labelledby="contact-heading" onClose={()=>setStatus("")}
      onClick={event=>{
        const bounds=event.currentTarget.getBoundingClientRect();
        if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)event.currentTarget.close();
      }}>
      <button className="contact-close" aria-label="Close contact panel" onClick={()=>dialog.current?.close()}><X size={18} aria-hidden="true"/></button>
      <h2 id="contact-heading">Say hello.</h2>
      <p>Email me or find me on LinkedIn.</p>
      <label className="contact-address-label" htmlFor="contact-email">Email address</label>
      <div className="contact-address">
        <input ref={address} id="contact-email" type="text" readOnly value={email} spellCheck={false}/>
        <button className="contact-copy" onClick={copyEmail} aria-label="Copy email address">
          {status==="Email copied."?<Check size={16} aria-hidden="true"/>:<Copy size={16} aria-hidden="true"/>}
          <span>Copy</span>
        </button>
      </div>
      <div className="contact-options">
        <a href={gmail} target="_blank" rel="noreferrer">Open Gmail <ArrowUpRight size={13} aria-hidden="true"/></a>
        <a href={`mailto:${email}`}>Email app <ArrowUpRight size={13} aria-hidden="true"/></a>
        <a href="https://www.linkedin.com/in/shyam-a458a7250/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} aria-hidden="true"/></a>
      </div>
      <p className="contact-status" role="status">{status}</p>
    </dialog>
  </>;
}
