#!/bin/sh
#
# RigWorks pre-commit: Semantic Versioning consistency.
# This file is version-controlled. Install with:
#   npm run hooks:install
#
# Docs-only / tooling commits do NOT need a VERSION bump.
# Bump VERSION only when schema meaning changes (see docs/versioning.md).
#

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT" || exit 1

# Prefer node.exe — MSYS/ucrt64 ships a bash wrapper named `node` that fails
# under Git for Windows hook shells (sh.exe): "No such file or directory".
resolve_node() {
	for candidate in \
		"$(command -v node.exe 2>/dev/null)" \
		"/c/Program Files/nodejs/node.exe" \
		"/c/Program Files (x86)/nodejs/node.exe" \
		"${LOCALAPPDATA}/Programs/node/node.exe" \
		"${HOME}/AppData/Local/Programs/node/node.exe" \
		"$(command -v node 2>/dev/null)"
	do
		[ -n "$candidate" ] || continue
		[ -f "$candidate" ] || continue
		case "$candidate" in
		*/node)
			if [ -f "${candidate}.exe" ]; then
				candidate="${candidate}.exe"
			fi
			;;
		esac
		if "$candidate" -v >/dev/null 2>&1; then
			printf '%s\n' "$candidate"
			return 0
		fi
	done
	return 1
}

echo "pre-commit: RigWorks SemVer check (VERSION + site badges)..."

NODE="$(resolve_node)" || {
	echo "pre-commit: FAILED - node not found on PATH."
	echo "pre-commit: Open a terminal where 'node -v' works, add Node to PATH, retry."
	echo "pre-commit: You do NOT need to bump VERSION for that."
	exit 1
}

# Let check-version print the real reason (stdout+stderr). Do not hide it.
if ! "$NODE" tools/check-version.mjs; then
	echo "pre-commit: FAILED - see check-version lines above."
	echo "pre-commit: Docs/tooling-only commits: leave VERSION alone (still 0.x.y)."
	echo "pre-commit: Schema meaning changed: bump VERSION + History row, update site badges."
	echo "pre-commit: Or run: node tools/check-version.mjs"
	exit 1
fi

echo "pre-commit: ok"
exit 0
