#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 \"Product Name\" primary-platform"
  echo "Example: $0 \"MoneyClock\" web"
  exit 1
fi

product_name="$1"
primary_platform="$2"
project_type="application"
primary_stack="[PRIMARY_STACK]"
primary_platform_priority="$primary_platform-first experience"
reference_context="[PRIMARY_REFERENCE_CONTEXT]"

tmp_file="$(mktemp)"
find . -type f \
  ! -path '*/.git/*' \
  ! -path './LICENSE' \
  ! -path './scripts/init-project.sh' | while read -r file; do
  sed \
    -e "s/\[PRODUCT_NAME\]/$product_name/g" \
    -e "s/\[PRIMARY_PLATFORM\]/$primary_platform/g" \
    -e "s/\[PROJECT_TYPE\]/$project_type/g" \
    -e "s/\[PRIMARY_STACK\]/$primary_stack/g" \
    -e "s/\[PRIMARY_PLATFORM_PRIORITY\]/$primary_platform_priority/g" \
    -e "s/\[PRIMARY_REFERENCE_CONTEXT\]/$reference_context/g" \
    "$file" > "$tmp_file"
  mv "$tmp_file" "$file"
done

echo "Initialized template placeholders for $product_name ($primary_platform)."
echo "Review the remaining placeholders like [TARGET_USER] and [CORE_DOMAIN_MODEL] manually."
