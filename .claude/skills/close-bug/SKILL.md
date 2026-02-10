---
name: close-bug
description: Close a resolved issue
disable-model-invocation: true
argument-hint: issue number
---

Close an issue in `docs/issues/`.

From $ARGUMENTS (or conversation context), determine the issue number.

1. Find the issue file matching that number in `docs/issues/`.
2. Set `status: closed` in the YAML frontmatter.
3. Append a final `## Updates` entry with today's date summarising the resolution. Use conversation context if available; otherwise ask what fixed it.
4. Move the file to `docs/issues/closed/`.
5. In `docs/issues/README.md`, move the issue's row from the **Open** table to the **Closed** table.
