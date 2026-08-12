#!/bin/sh
set -eu

git submodule update --init --remote --recursive

git config --file .gitmodules --get-regexp '\.path$' |
  while read -r _ path; do
    git add -- "$path"
  done

git diff --cached --quiet || git commit -m "chore(blog): update"
