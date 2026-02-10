---
name: file-bug
description: File a bug in docs/issues/
disable-model-invocation: true
argument-hint: description of the bug
---

Create a new issue file in `docs/issues/`.

1. Determine the next issue number by listing existing files in `docs/issues/` and incrementing the highest number.
2. Create `docs/issues/NNN-slug.md` where NNN is zero-padded to 3 digits and slug is a short kebab-case summary.
3. Use this template:

```markdown
---
status: open
created: YYYY-MM-DD
tags: [bug]
---

# Title

Description.

**Affected code**: `file:function()`

## Updates

### YYYY-MM-DD

Initial report.
```

From $ARGUMENTS (or the conversation context if no arguments), write:
- A concise title (imperative or noun phrase)
- A 1-3 sentence description of the problem and expected behavior
- An affected code line pointing to relevant file(s) and function(s)

Keep it terse. Don't editorialize or add priority/severity.
