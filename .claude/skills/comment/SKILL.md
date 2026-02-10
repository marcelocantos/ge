---
name: comment
description: Add a comment to an issue
disable-model-invocation: true
argument-hint: issue number and comment text
---

Add an update entry to an issue in `docs/issues/`.

From $ARGUMENTS, extract the issue number and the comment text.

1. Find the issue file matching that number in `docs/issues/` (or `docs/issues/closed/`).
2. Append a new dated subsection under `## Updates`:

```markdown
### YYYY-MM-DD — Author Name

Comment text here.
```

Resolve the author name via `git config user.name`. Use today's date. If there's already an entry for today, append a second `### YYYY-MM-DD` section (don't merge).

Keep the comment concise. If $ARGUMENTS contains just a number with no comment text, use the recent conversation context to write a brief status update.
