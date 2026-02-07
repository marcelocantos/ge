#!/usr/bin/env python3
"""Generate include dependency graph for project source files.

Usage: depgraph.py [--format svg|png|dot] [--output FILE] [DIRS...]

Parses #include directives from .cpp/.h files and outputs a graphviz graph.
By default, scans src/ and sq/src/ sq/include/ directories.
"""

import argparse
import os
import re
import sys
from pathlib import Path

# Include patterns
INCLUDE_RE = re.compile(r'^\s*#include\s+[<"]([^>"]+)[>"]', re.MULTILINE)

# File extensions to scan
SOURCE_EXTS = {'.cpp', '.c', '.h', '.hpp'}

# Paths to ignore (vendor code, system headers)
IGNORE_PATHS = {'vendor', 'build', '.git'}

# Standard library headers to skip
STL_HEADERS = {
    'algorithm', 'any', 'array', 'atomic', 'bit', 'bitset', 'cassert', 'cctype',
    'cerrno', 'cfenv', 'cfloat', 'charconv', 'chrono', 'cinttypes', 'climits',
    'clocale', 'cmath', 'compare', 'complex', 'concepts', 'condition_variable',
    'coroutine', 'csetjmp', 'csignal', 'cstdarg', 'cstddef', 'cstdint', 'cstdio',
    'cstdlib', 'cstring', 'ctime', 'cuchar', 'cwchar', 'cwctype', 'deque',
    'exception', 'expected', 'filesystem', 'format', 'forward_list', 'fstream',
    'functional', 'future', 'initializer_list', 'iomanip', 'ios', 'iosfwd',
    'iostream', 'istream', 'iterator', 'latch', 'limits', 'list', 'locale',
    'map', 'memory', 'memory_resource', 'mutex', 'new', 'numbers', 'numeric',
    'optional', 'ostream', 'print', 'queue', 'random', 'ranges', 'ratio', 'regex',
    'scoped_allocator', 'semaphore', 'set', 'shared_mutex', 'source_location',
    'span', 'spanstream', 'sstream', 'stack', 'stacktrace', 'stdexcept',
    'stop_token', 'streambuf', 'string', 'string_view', 'syncstream', 'system_error',
    'thread', 'tuple', 'type_traits', 'typeindex', 'typeinfo', 'unordered_map',
    'unordered_set', 'utility', 'valarray', 'variant', 'vector', 'version',
}

def should_ignore(path: Path) -> bool:
    """Check if path should be ignored."""
    return any(part in IGNORE_PATHS for part in path.parts)

def normalize_header(inc: str) -> str | None:
    """Normalize include path, returning None for system/vendor headers."""
    # Skip standard library headers
    if inc in STL_HEADERS:
        return None
    # Skip system/vendor headers by prefix
    if inc.startswith(('std', 'SDL', 'spdlog/')):
        return None
    # Skip other vendor headers
    if '/' in inc and inc.split('/')[0] in ('nlohmann', 'doctest'):
        return None
    return inc

def scan_file(path: Path) -> set[str]:
    """Extract includes from a single file."""
    try:
        content = path.read_text(encoding='utf-8', errors='ignore')
        includes = set()
        for match in INCLUDE_RE.finditer(content):
            inc = match.group(1)
            normalized = normalize_header(inc)
            if normalized:
                includes.add(normalized)
        return includes
    except Exception as e:
        print(f"Warning: Could not read {path}: {e}", file=sys.stderr)
        return set()

def scan_directory(root: Path) -> dict[str, set[str]]:
    """Scan directory for source files and their includes."""
    deps = {}
    for path in root.rglob('*'):
        if path.suffix not in SOURCE_EXTS:
            continue
        if should_ignore(path):
            continue

        # Use relative path from project root
        rel = path.relative_to(Path.cwd()) if path.is_absolute() else path
        key = str(rel)

        includes = scan_file(path)
        if includes:
            deps[key] = includes

    return deps

def simplify_name(path: str) -> str:
    """Simplify path for display."""
    # Remove common prefixes
    for prefix in ['sq/include/sq/', 'sq/src/', 'sq/include/', 'src/', 'include/']:
        if path.startswith(prefix):
            return path[len(prefix):]
    return path

def generate_dot(deps: dict[str, set[str]], title: str = "Include Dependencies") -> str:
    """Generate DOT graph from dependencies."""
    lines = [
        'digraph includes {',
        '  rankdir=LR;',
        '  node [shape=box, fontname="Helvetica", fontsize=10];',
        '  edge [color="#666666"];',
        f'  label="{title}";',
        '  labelloc=t;',
        '',
    ]

    # Collect all nodes
    all_nodes = set()
    for src, includes in deps.items():
        all_nodes.add(src)
        all_nodes.update(includes)

    # Color nodes by type
    for node in sorted(all_nodes):
        simple = simplify_name(node)
        escaped = simple.replace('"', '\\"')

        # Color by category
        if 'sq/' in node or node.startswith('sq/'):
            color = '#e6f3ff'  # Light blue for sq/
        elif node.endswith('.cpp') or node.endswith('.c'):
            color = '#ffe6e6'  # Light red for source
        elif 'Internal' in node:
            color = '#fff0e6'  # Light orange for internal
        else:
            color = '#e6ffe6'  # Light green for headers

        lines.append(f'  "{escaped}" [label="{escaped}", style=filled, fillcolor="{color}"];')

    lines.append('')

    # Add edges
    for src, includes in sorted(deps.items()):
        src_simple = simplify_name(src)
        for inc in sorted(includes):
            inc_simple = simplify_name(inc)
            lines.append(f'  "{src_simple}" -> "{inc_simple}";')

    lines.append('}')
    return '\n'.join(lines)

def main():
    parser = argparse.ArgumentParser(description='Generate include dependency graph')
    parser.add_argument('dirs', nargs='*', default=['src', 'sq/src', 'sq/include'],
                        help='Directories to scan (default: src sq/src sq/include)')
    parser.add_argument('--format', '-f', choices=['dot', 'svg', 'png'], default='svg',
                        help='Output format (default: svg)')
    parser.add_argument('--output', '-o', default='deps',
                        help='Output file base name (default: deps)')
    args = parser.parse_args()

    # Scan directories
    all_deps = {}
    for dir_path in args.dirs:
        path = Path(dir_path)
        if path.exists():
            all_deps.update(scan_directory(path))

    if not all_deps:
        print("No dependencies found.", file=sys.stderr)
        return 1

    # Generate DOT
    dot_content = generate_dot(all_deps)

    if args.format == 'dot':
        output_file = f"{args.output}.dot"
        Path(output_file).write_text(dot_content)
        print(f"Generated {output_file}")
    else:
        # Write DOT file then convert
        dot_file = f"{args.output}.dot"
        Path(dot_file).write_text(dot_content)

        output_file = f"{args.output}.{args.format}"
        import subprocess
        result = subprocess.run(
            ['dot', f'-T{args.format}', dot_file, '-o', output_file],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            print(f"Error running dot: {result.stderr}", file=sys.stderr)
            return 1
        print(f"Generated {output_file}")

    return 0

if __name__ == '__main__':
    sys.exit(main())
