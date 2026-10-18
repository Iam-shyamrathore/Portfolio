export type Project = {
  slug: string;
  name: string;
  category: "Company work" | "Independent" | "Research" | "Open source";
  discipline: "AI systems" | "Product & apps" | "Infrastructure" | "Research";
  line: string;
  description: string;
  status: string;
  stack: string[];
  question: string;
  decisions: { title: string; before?: string; text: string; tradeoff?: string }[];
  verification: string;
  relatedPost?: string;
  takeaway: string;
  links?: { label: string; href: string }[];
  liveSite?: { url: string; embeddable: boolean; previewImage?: string };
};
export const projects: Project[] = [
  {
    "slug": "yolearn",
    "name": "YoLearn.ai",
    "category": "Company work",
    "discipline": "AI systems",
    "line": "Recover the run. Preserve the result. Charge once.",
    "description": "Resumable tutoring runs, duplicate-payment protection, and fixes that keep generated content visible.",
    "status": "AI Engineer · Oct 2025–present · Source private",
    "stack": [
      "Python",
      "FastAPI",
      "LangGraph",
      "PostgreSQL",
      "Redis",
      "Qdrant",
      "TypeScript"
    ],
    "question": "A teacher can lose a connection halfway through generation. A payment can arrive through two handlers. A completed stream can contain less information than the frames before it. I work across these boundaries so the product has a consistent answer about what happened.",
    "decisions": [
      {
        "title": "A reconnect should find the same operation",
        "before": "An open connection is a fragile place to keep the identity of a long-running task.",
        "text": "I added resumable teacher runs with ordered Redis events and cursor-based replay. PostgreSQL retains the completed document and terminal settlement. When recent events have expired, the gateway returns a snapshot and an explicit gap instead of pretending it can replay everything.",
        "tradeoff": "The journal is bounded. Reconnecting restores a view of a run; it does not promise that every interrupted worker can continue generating."
      },
      {
        "title": "Two payment handlers, one fulfillment",
        "before": "Webhook delivery and browser verification could race and create duplicate payment records.",
        "text": "I added transaction-scoped advisory locks, a second fulfillment check inside the transaction, and ledger idempotency checks. I also repaired the billing-history view to merge duplicate fragments while retaining distinct renewal payments.",
        "tradeoff": "Cleaning up the history view helps the user read it. The transaction guard protects the write; both need attention."
      },
      {
        "title": "A completed frame must not erase an image",
        "before": "The UI could receive an image during streaming, then lose it when the final document carried an empty asset list.",
        "text": "I merged ready assets by stable identifier and preserved them across an empty terminal frame. I added a regression case that sends the same asset twice, completes with an empty list, and checks that the image remains."
      },
      {
        "title": "A cache hit should stop generation",
        "before": "The full-length test pool looked up a cached paper under the wrong key and could fall back to generating another one.",
        "text": "I corrected the lookup and the cached response path, including both PDF links. The regression test makes generation throw if it is called on a valid cache hit—so an accidental fallback cannot pass unnoticed."
      }
    ],
    "takeaway": "I start with a concrete failure path, trace it across services, and put a test at the point where the system previously lost its guarantee.",
    "links": [
      {
        "label": "Live website",
        "href": "https://yolearn.ai/"
      }
    ],
    "verification": "These changes are backed by authored commits and regression cases in the gateway, generation service, and web client. Company source stays private.",
    "relatedPost": "a-stream-is-not-the-work",
    "liveSite": {
      "url": "https://yolearn.ai/",
      "embeddable": false,
      "previewImage": "https://www.yolearn.ai/og_image.png"
    }
  },
  {
    "slug": "previo",
    "name": "Previo",
    "category": "Independent",
    "discipline": "Infrastructure",
    "line": "Let an agent edit the plan without owning the rules.",
    "description": "AI-assisted cloud architecture with validated edits, explicit pricing evidence, and reversible graph changes.",
    "status": "In development · Private repository",
    "stack": [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Typed service catalogs"
    ],
    "question": "An architecture suggestion can look reasonable while referring to an old board, a different scenario, or a service with no usable price. I built the mutation boundary so those cases produce an explicit answer before they change the canvas.",
    "decisions": [
      {
        "title": "Reject a proposal made against an old board",
        "before": "A generated edit can become stale while someone continues working on the canvas.",
        "text": "I built a deterministic patch engine that checks workspace, board, scenario, and base revision. It validates stable IDs and connection endpoints, applies operations to cloned state, and produces a new revision.",
        "tradeoff": "A stale edit is rejected rather than silently rebased. That requires another proposal, but avoids quietly changing its meaning."
      },
      {
        "title": "Deletion must account for the edges",
        "before": "Removing a component can leave connections pointing to something that no longer exists.",
        "text": "The engine requires an explicit cascade before deleting a connected component. I added inverse patches that restore its semantic objects, visual bindings, and connections. Tests check restoration while the revision continues to advance."
      },
      {
        "title": "A missing price stays missing",
        "before": "A precise-looking estimate is misleading if its service binding or pricing evidence is stale.",
        "text": "Cost calculations use typed service records and explicit active-price bindings. An incomplete or expired binding stays unpriced. The model can suggest an architecture; it cannot turn an absent pricing record into a fact.",
        "tradeoff": "Some boards remain partially priced. I prefer that visible gap to an estimate whose source cannot be explained."
      }
    ],
    "takeaway": "For an agent that changes state, the proposal, validation result, and applied revision are separate artifacts. That separation makes review and undo practical.",
    "links": [
      {
        "label": "Live website",
        "href": "https://previo.tech/"
      }
    ],
    "verification": "Authored patch-engine tests cover stale and cross-scope requests, connected-node removal, inverse restoration, and typed failures. Previo remains in development.",
    "relatedPost": "let-the-agent-propose",
    "liveSite": {
      "url": "https://previo.tech/",
      "embeddable": true
    }
  },
  {
    "slug": "apcan",
    "name": "APCAN",
    "category": "Open source",
    "discipline": "AI systems",
    "line": "A voice interface still needs explicit actions and failures.",
    "description": "A voice-first administration prototype with specialist agents, explicit failures, and a shared care cockpit.",
    "status": "Open-source prototype",
    "stack": [
      "FastAPI",
      "Gemini Live",
      "LangGraph",
      "WebSockets",
      "PostgreSQL",
      "FHIR R4"
    ],
    "question": "A patient lookup, a scheduling request, and a general question need different tools. I built the voice-to-workflow path and worked on what the interface should do when one of those paths fails.",
    "decisions": [
      {
        "title": "One specialist failure should not end the conversation",
        "before": "An exception inside a specialist subgraph could escape into the voice session.",
        "text": "I added error boundaries around the specialist calls and explicit fallback responses for classifier and general-response failures. The session can report the failed action without presenting it as a successful tool result."
      },
      {
        "title": "Keep the conversation and its actions inspectable",
        "before": "A follow-up question needs prior context, and a state-changing tool call needs more than a line of generated text.",
        "text": "I added multi-turn history to the agent state and audit records around tool execution. The implementation includes argument sanitization and records failure as well as success.",
        "tradeoff": "These are prototype engineering controls. They do not establish clinical validation or regulatory certification."
      },
      {
        "title": "Put voice and record context in one workspace",
        "text": "I replaced a fragmented chat flow with a care cockpit that keeps speech input, spoken responses, and the relevant patient context together. I also moved repeated model construction into a shared factory so specialist agents use the same provider configuration."
      }
    ],
    "takeaway": "I want the interface to distinguish “the assistant replied” from “the requested action completed.” Voice makes that distinction easier to overlook, so the surrounding workflow must make it explicit.",
    "links": [
      {
        "label": "Live website",
        "href": "https://apcan-eight.vercel.app/"
      },
      {
        "label": "Source & change history",
        "href": "https://github.com/Iam-shyamrathore/APCAN"
      },
      {
        "label": "Agent failure boundaries",
        "href": "https://github.com/Iam-shyamrathore/APCAN/commit/0ec3f779ec0544c2388a846d86a9018b3dc3d51f"
      }
    ],
    "verification": "The public history contains agent-failure, conversation-history, audit-sanitization, and rate-limit tests. The latest cockpit and model-factory changes are visible in the linked source.",
    "liveSite": {
      "url": "https://apcan-eight.vercel.app/",
      "embeddable": true
    }
  },
  {
    "slug": "prachaar",
    "name": "Prachaar AI",
    "category": "Company work",
    "discipline": "AI systems",
    "line": "Save the findings before announcing the progress.",
    "description": "Evidence-backed business audits with durable report snapshots, specialist findings, and a frontend that can recover saved work.",
    "status": "Company project · Source private",
    "stack": [
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "Redis",
      "Agent workflows"
    ],
    "question": "An audit is useful after its progress stream has ended. I worked on preserving the findings, their sources, and their completion state independently of the browser that started the job.",
    "decisions": [
      {
        "title": "A closed tab should not own the job",
        "before": "Transient updates were not enough to reconstruct a report after leaving the session.",
        "text": "I added database-backed audit runs and a separate worker. Each checkpoint commits the snapshot before broadcasting it. If broadcasting fails, the saved revision remains available for a returning client."
      },
      {
        "title": "Keep useful findings when another check fails",
        "before": "A failed specialist or expired worker lease could otherwise make a partly useful audit look empty.",
        "text": "The worker preserves completed sections, marks unfinished checks as failed, and saves an explicit partial or failed state. Worker ownership and lease checks prevent an expired worker from overwriting a newer state.",
        "tradeoff": "An expired run becomes an inspectable failure with retained findings. This is not a promise of automatic continuation for every failed job."
      },
      {
        "title": "Show the evidence and its gaps",
        "text": "The report keeps section findings, citations, and synthesis separate. The frontend reconciles saved revisions with live updates. Checks without available evidence remain unavailable instead of borrowing confidence from the rest of the report."
      }
    ],
    "takeaway": "The save order is part of the product contract: a progress update should describe a state the user can actually recover.",
    "verification": "The authored tests cover duplicate starts, workspace isolation, lease ownership, retained findings, and persisted snapshots matching broadcast revisions.",
    "relatedPost": "choose-what-your-database-remembers"
  },
  {
    "slug": "siin",
    "name": "SIIN",
    "category": "Research",
    "discipline": "Research",
    "line": "Infer a skill, and show why the evidence supports it.",
    "description": "My research prototype explores GitHub evidence with graph search and reports belief, plausibility, and uncertainty.",
    "status": "Research prototype · Unpublished manuscript",
    "stack": [
      "Python",
      "NetworkX",
      "TF-IDF",
      "MCTS",
      "Dempster–Shafer theory",
      "FastAPI",
      "React"
    ],
    "question": "Commit counts say little about what someone implemented. SIIN connects developers, repositories, changes, and candidate skills so an inference can be followed back through its evidence.",
    "decisions": [
      {
        "title": "Search relationships rather than count activity",
        "text": "I represented the evidence as a heterogeneous NetworkX graph, weighted patches with TF-IDF, and used LLM-guided Monte Carlo Tree Search to explore candidate skill paths. Search prioritization is a heuristic; it is not an independent measurement of ability."
      },
      {
        "title": "Keep conflicting evidence uncertain",
        "text": "The confidence layer separates support, opposition, and unknown evidence. Yager’s combination rule moves conflicting mass into uncertainty. Belief and plausibility expose the remaining range instead of hiding it behind one precise-looking score.",
        "tradeoff": "The manuscript evaluates five developers. That is an exploratory study, not a validated hiring score or a general performance claim."
      },
      {
        "title": "Fix the graph that did not fit its container",
        "before": "A fixed-size 3D visualization could appear off-center or cropped when the dashboard changed size.",
        "text": "I added a ResizeObserver on the actual graph container and passed its measured width and height to the renderer. Cleanup disconnects the observer. The fix follows the space the graph occupies, including layout changes that are not simply a new browser width."
      }
    ],
    "takeaway": "A useful inference needs both an evidence trail and a readable interface. I treat uncertainty and visualization as parts of the same explanation.",
    "links": [
      {
        "label": "Live website",
        "href": "https://siingithub.vercel.app/"
      },
      {
        "label": "Manuscript & study limits",
        "href": "/research"
      },
      {
        "label": "Source on GitHub",
        "href": "https://github.com/Iam-shyamrathore/graph-skill-infrence"
      },
      {
        "label": "Graph sizing fix",
        "href": "https://github.com/Iam-shyamrathore/graph-skill-infrence/commit/36e3ad0736fdce4253cc5f97f79bcb988106202c"
      }
    ],
    "verification": "The public graph-centering commit can be inspected directly. The manuscript and source are linked together; the paper remains unpublished.",
    "liveSite": {
      "url": "https://siingithub.vercel.app/",
      "embeddable": true
    }
  },
  {
    "slug": "maangroute",
    "name": "MAANGRoute",
    "category": "Independent",
    "discipline": "Product & apps",
    "line": "Make a daily action mean one thing in the database.",
    "description": "A personal planning app combining habits, coding practice, contest feeds, and authenticated daily records.",
    "status": "Independent product · Private repository",
    "stack": [
      "Next.js",
      "React",
      "TypeScript",
      "Prisma",
      "PostgreSQL"
    ],
    "question": "A habit toggle looks small, but it still needs an owner, a date, and one durable meaning. I built the product around those rules and made external contest data useful without depending on a single feed.",
    "decisions": [
      {
        "title": "One habit, one calendar date",
        "text": "Habit logs have a composite unique key for habit and date. The server verifies ownership, normalizes the supplied calendar date, and upserts the completion state. Repeated saves address the same record.",
        "tradeoff": "Uniqueness prevents duplicate rows. It does not decide which conflicting user intent should win; that remains an application-level decision."
      },
      {
        "title": "Keep a missing provider from emptying every feed",
        "text": "The contest endpoint uses an aggregate feed first, then fetches missing platform data directly. I normalize and deduplicate the results before sorting them by start time. Requests are cached to avoid fetching every provider on every page visit."
      },
      {
        "title": "A private page still needs a protected endpoint",
        "before": "Hiding a UI route does not protect an API someone calls directly.",
        "text": "My security update added an authentication check to the contest endpoint and moved provider credentials into server-side configuration. Registration and verification paths also gained rate limits and stricter validation."
      }
    ],
    "takeaway": "I try to define the identity and owner of a record before designing the dashboard that displays it.",
    "links": [
      {
        "label": "Live website",
        "href": "https://www.maangroute.dev/"
      }
    ],
    "verification": "Authored history includes the feed integration and authentication hardening. The schema and server actions define the ownership and daily-record rules.",
    "relatedPost": "choose-what-your-database-remembers",
    "liveSite": {
      "url": "https://www.maangroute.dev/",
      "embeddable": false
    }
  },
  {
    "slug": "speechee",
    "name": "Speechee",
    "category": "Independent",
    "discipline": "Product & apps",
    "line": "Make the next speaking attempt feel simple.",
    "description": "A React Native speech-learning app where I work on the practice loop, local progress, and transitions between screens.",
    "status": "Mobile app · In development · Source private",
    "stack": [
      "React Native",
      "Expo",
      "TypeScript",
      "Speech recognition",
      "Local storage"
    ],
    "question": "A child should move from a lesson to speaking without a flash, a stalled control, or an unexplained result. My work includes both the learning interaction and the lifecycle bugs introduced while smoothing it.",
    "decisions": [
      {
        "title": "Remove the blank frame between screens",
        "before": "Sequential fade-out and screen replacement exposed a white flash during navigation.",
        "text": "I kept the screens mounted and crossfaded their opacity and position concurrently. Pointer events follow the active screen, and a transition guard prevents overlapping navigation requests.",
        "tradeoff": "Mounted screens retain state and run effects. I later restricted the speaking and results screens to the active flow to prevent speech playback on app launch."
      },
      {
        "title": "Handle the empty session that mounting revealed",
        "before": "Once the speaking screen stayed mounted, it could render before session words existed and read stageId from an undefined item.",
        "text": "I added a bounded fallback item and guarded the last-question calculation. The screen can mount safely while the session is being prepared; the selected words still drive the actual practice flow."
      },
      {
        "title": "Be precise about what speech feedback measures",
        "text": "My initial implementation explored aliases, phonetic keys, and edit distance. A later team change uses normalized exact text matching. The current validator compares a transcript with a target word; it does not measure phoneme-level pronunciation.",
        "tradeoff": "The simpler current rule rejects some conversational answers. The portfolio should describe that behavior honestly rather than imply a pronunciation score."
      }
    ],
    "takeaway": "Keeping a screen mounted changes more than its animation. I now review its initial state and side effects whenever I change a navigation transition.",
    "verification": "The navigation and empty-session fixes are authored commits. The current validator was checked against the repository; the later matching change is attributed to the team.",
    "relatedPost": "forgiving-speech-interfaces",
    "liveSite": {
      "url": "https://speechee-website.vercel.app/",
      "embeddable": true
    },
    "links": [
      {
        "label": "Live website",
        "href": "https://speechee-website.vercel.app/"
      }
    ]
  },
  {
    "slug": "nanograd",
    "name": "NanoGrad",
    "category": "Open source",
    "discipline": "Research",
    "line": "Follow a gradient all the way back to a scalar.",
    "description": "An early Python learning project implementing scalar automatic differentiation, neurons, and a small MLP.",
    "status": "Open-source learning project",
    "stack": [
      "Python",
      "Automatic differentiation",
      "Backpropagation",
      "Graphviz"
    ],
    "question": "I wanted to understand what an ML framework does between evaluating an expression and updating its parameters. Building the scalar graph made that hidden step small enough to inspect.",
    "decisions": [
      {
        "title": "Keep the local derivative beside the operation",
        "text": "Each scalar operation creates a value with references to its parents and a small backward function. Addition, multiplication, and tanh each supply their local derivative. A reverse topological traversal then propagates the output gradient."
      },
      {
        "title": "Accumulate contributions from shared values",
        "text": "Backward functions add to a parent’s gradient rather than replacing it. That matters when the same scalar appears on more than one path: x × x + x has three contributions to combine. A tiny expression is easier to reason about than a whole training loop."
      },
      {
        "title": "Keep the project’s scope small",
        "text": "I built neurons, layers, and graph visualization around that scalar core. It is an educational implementation. The checked-in training example and tests are limited, so I do not use the repository as evidence of a complete production training framework."
      }
    ],
    "takeaway": "When a high-level system feels opaque, I like rebuilding one small mechanism until I can explain each step.",
    "links": [
      {
        "label": "Source on GitHub",
        "href": "https://github.com/Iam-shyamrathore/Nanograd"
      }
    ],
    "verification": "The scalar engine is public. The expression x × x + x at x = 3 was checked locally and produces a gradient of 7."
  }
];
export const featuredProjects = projects.slice(0, 3);
