#!/bin/sh
#
# RigWorks pre-push: full CI precheck (same steps as npm run check).
# Uses node only — Git GUI hooks on Windows often lack npm on PATH.
# Install with: npm run hooks:install
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

NODE="$(resolve_node)" || {
	echo "pre-push: node is required for CI precheck" >&2
	exit 1
}

echo "pre-push: running CI precheck (same gate as npm run check)..."

fail() {
	echo "pre-push: $1 failed - fix before pushing" >&2
	exit 1
}

"$NODE" tools/check-version.mjs || fail "check:version"
"$NODE" tools/gen-schemas.mjs --check || fail "check:schemas"
"$NODE" tools/check-schema-parity/check.mjs || fail "check:parity"
"$NODE" tools/check-links.mjs || fail "check:links"
"$NODE" tools/sync-snippets.mjs --check || fail "check:snippets"
"$NODE" tools/render-svg.mjs --check || fail "check:svg"
"$NODE" tools/rig-validate/cli.js --strict \
	examples/minimal-scene.json \
	examples/lfo-binding.json \
	examples/ui-panel.json \
	examples/portable-tool.json \
	examples/path3d-spline3d.json || fail "check:examples"
"$NODE" --test tools/test/*.test.mjs || fail "test"

echo "Pre-push checks passed"
exit 0
