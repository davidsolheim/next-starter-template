#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMPDIR="${TMPDIR:-/tmp}"
PROJECT="${DOPPLER_PROJECT:-next-starter-template}"

cd "$ROOT"

if ! command -v doppler >/dev/null 2>&1; then
  echo "doppler CLI is required. Install: https://docs.doppler.com/docs/install-cli" >&2
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI is required and the repo must be linked (vercel link)." >&2
  exit 1
fi

filter_app_secrets() {
  grep -vE '^(VERCEL(_|$)|TURBO_|NX_|DOPPLER_)' "$1" > "$2" || true
}

import_env() {
  local environment="$1"
  local config="$2"
  local outfile="$TMPDIR/starter-vercel-${environment}.env"
  local filtered="$TMPDIR/starter-vercel-${environment}.filtered.env"

  vercel env pull "$outfile" --environment="$environment" --yes >/dev/null

  filter_app_secrets "$outfile" "$filtered"

  if [ -s "$filtered" ]; then
    doppler secrets upload "$filtered" --project "$PROJECT" --config "$config" >/dev/null
    local count
    count="$(grep -c '=' "$filtered" || true)"
    echo "Imported ${count} app secret(s) into Doppler config '${config}' from Vercel '${environment}'."
  else
    echo "No app secrets found in Vercel '${environment}'."
  fi
}

import_env development development
import_env preview preview
import_env production production
