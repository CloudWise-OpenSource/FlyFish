#!/bin/bash
set -e

red() {
    echo -e "\033[;31m${1}\033[0m"
}

uname_out="$(uname -s)"
case "${uname_out}" in
Linux*)
    bash scripts/linux/flyfish-linux-startup.sh
    ;;
Darwin*)
    bash scripts/macos/flyfish-macos-startup.sh
    cd code-server && npm run macos-start && cd ../
    npm run dev
    ;;
CYGWIN* | MINGW*)
    red "Warning: not support CYGWIN or MINNGW!"
    ;;
*)
    red "Warning: not support UNKNOWN:${uname_out}!"
    ;;
esac
