#!/bin/sh
#
# RigWorks pre-commit: Semantic Versioning consistency.
# This file is version-controlled. Install with:
#   npm run hooks:install
#

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT" || exit 1

if ! command -v node >/dev/null 2>&1; then
	echo "pre-commit: node is required for SemVer check" >&2
	exit 1
fi

node tools/check-version.mjs || {
	echo "pre-commit: SemVer check failed - see docs/versioning.md" >&2
	exit 1
}

echo "Pre-commit checks passed"
exit 0
