---
name: assign
description: Assign an issue to someone
disable-model-invocation: true
argument-hint: issue number and assignee name
---

Assign an issue in `docs/issues/` to a person.

From $ARGUMENTS, extract the issue number and assignee name.

1. Find the issue file matching that number in `docs/issues/` (or `docs/issues/closed/`).
2. Set `assignee: <name>` in the YAML frontmatter (add the field if it doesn't exist).
3. Update the Assignee column for that issue's row in `docs/issues/README.md`.

If no assignee name is given, clear the field (remove it from frontmatter, blank the column).
