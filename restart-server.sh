#!/bin/bash
cd /home/z/my-project
while true; do
  NODE_OPTIONS="--max-old-space-size=512" node node_modules/.bin/next dev -p 3000 -H 0.0.0.0 2>&1
  echo "[$(date)] Server exited with code $?, restarting in 1s..."
  sleep 1
done
