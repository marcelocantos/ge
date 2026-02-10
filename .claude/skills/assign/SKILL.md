---
name: assign
description: Assign an issue to someone
disable-model-invocation: true
argument-hint: issue number and assignee name
---

Assign an issue in `docs/issues/` to a person.

From $ARGUMENTS, extract the issue number and assignee name.

### Resolve the assignee name

1. **"me"**: If the name is "me", resolve to the current user via `git config user.name`.
2. **Lookup**: Get a list of known contributors from `git log --format='%aN' | sort -u`. Match the given name case-insensitively against this list.
3. **Strong match** (unique substring or exact match): use the full name from git history.
4. **Multiple matches**: show the candidates and ask which one.
5. **No match**: ask the user to confirm the name as-is (they may be adding a new person).

### Update the issue

1. Find the issue file matching that number in `docs/issues/` (or `docs/issues/closed/`).
2. Set `assignee: <resolved name>` in the YAML frontmatter (add the field if it doesn't exist).
3. Update the Assignee column for that issue's row in `docs/issues/README.md`.

If no assignee name is given, clear the field (remove it from frontmatter, blank the column).
