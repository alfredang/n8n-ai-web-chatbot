# Project Instructions

## Memory Management
- Always read `~/.claude/projects/-Users-alfredang-projects-n8n-chatbot/memory/MEMORY.md` at the start of each conversation for context from previous sessions.
- Update MEMORY.md with key decisions, preferences, and insights discovered during the session.
- Keep MEMORY.md under 200 lines — trim outdated or redundant entries to stay within this limit.
- For detailed notes, create separate topic files in the memory directory (e.g., `debugging.md`, `architecture.md`) and link from MEMORY.md.
- Do not duplicate information already present in this CLAUDE.md file into MEMORY.md.
- Before adding new memories, check if an existing entry can be updated instead.
- Remove memories that are no longer accurate or relevant.

## Secrets Management
- All API keys and secrets go in `.env` (already gitignored).
- Never hardcode secrets in source code or commit `.env` to git.
- Reference environment variables in code instead of raw values.
