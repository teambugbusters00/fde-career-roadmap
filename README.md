# FDE Career Command Center

A Vercel-ready Forward Deployed Engineer career tracker.

## Includes

- FDE roadmap: Learn → Build → Deploy → Prove
- 6-hour daily tracker
- Project and proof tracking
- Notes with downloads
- Architecture whiteboard
- YouTube learning workspace
- Groq AI coach using `openai/gpt-oss-20b`
- LocalStorage persistence and JSON backup/restore

## Vercel setup

1. Import this GitHub repository into Vercel.
2. Keep the project root at the repository root.
3. Add `GROQ_API_KEY` under Vercel Project Settings → Environment Variables.
4. Deploy.

Never commit the Groq API key to GitHub. The browser calls `/api/ai`, while the secret stays server-side in the Vercel function.