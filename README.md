# Gmail Apology Extension

This Chrome extension adds two handy controls **as a floating panel** inside Gmail (bottom-right):

- **Compose w/ Apology** — clicks Gmail’s Compose button and starts a new email with a randomly generated apology at the top.  
- **Reply w/ Apology** — clicks the current thread’s Reply button and inserts a randomly generated apology at the top of the reply body.  

All apologies are drawn from 30 hand-crafted templates, parameterized with adjectives to keep them varied and natural. Templates focus on replying late or tersely due to time constraints.

## Features

- 30 apology templates related to late/short replies.  
- Randomized adjective substitution for more diversity.  
- Floating panel UI avoids Gmail’s internal toolbar changes.  
- No backend, no API calls — runs entirely locally.  

## Installation

1. Save `manifest.json`, `content.js`, and `README.md` into a folder, e.g. `gmail-apology-extension/`.
2. In Chrome, open `chrome://extensions/` and enable **Developer mode** (top-right toggle).  
3. Click **Load unpacked** and select the `gmail-apology-extension/` folder.  
4. Open Gmail in a new tab. You’ll see a small floating panel in the bottom-right corner.

## Usage

- Click **Compose w/ Apology** to open a new draft; an apology is automatically prepended.  
- Click **Reply w/ Apology** while viewing a thread; a reply is opened and the apology is inserted at the top.  

If Gmail is very busy or slow, the insertion can take up to a second as the editor loads. The extension waits for the editor and then prepends the text.

## Notes / Troubleshooting

- If nothing appears, refresh the Gmail tab after loading the extension.  
- If your Gmail locale is not English, the **Reply** button text may differ. The extension searches common `aria-label`/`data-tooltip` values that start with “Reply”. If you need localization tweaks, update the `replyWithApology()` selector logic.  
- The panel sits on top of Gmail; you can move it by editing the `bottom`/`right` values in `content.js`.  
- The extension only modifies Gmail’s DOM locally in your browser and does not transmit any email contents.  

## How made this extension, and why?

This extension was made by Todd Austin @ University of Michigan. He is slow to answer email, so he wrote this tool to more quickly apologize.

The following lyrics summarize Todd's feelings on the matter. These lyrics are submitted for your approval and with apologies to OneRepublic:

> **Verse 1**
> I’m buried in the deadlines,
> Running circles in my mind.
> Yeah, I saw your message waiting,
> But I left your words behind.
> 
> You said this was urgent,
> That the moment mattered most—
> I meant to reach you sooner,
> Didn’t want to leave you lost.
> 
> **Chorus**
> But it’s not too late to apologize, not too late,
> No, it’s not too late to apologize, not too late.
> Not too late, oh—
> 
**Verse 2**
I’d put aside the noise, the calls,
Just to write to you.
I need to prove I still care,
Though my answer’s overdue.

I should’ve dropped it all before, replied without delay.
You were patient like an angel,
Waiting while I strayed away.
So let me say—

**Chorus**
It’s not too late to apologize, not too late,
I swear it’s not too late to apologize, not too late.
Not too late, whoa—

**Bridge**
Now I’m staring at your mail,
I won’t let you down again.
These words might come in late,
But they’re honest, every line I send.

**Final Chorus**
It’s not too late to apologize, not too late,
I said it’s not too late to apologize, not too late.
Not too late—yeah—
It’s not too late to apologize, not too late.

