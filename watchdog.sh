#!/bin/bash
cd /home/z/my-project
while true; do
  if ! ss -tlnp 2>/dev/null | grep -q ":3000"; then
    echo "$(date): Starting server..." >> /tmp/watchdog.log
    npx next dev -p 3000 -H 0.0.0.0 >> /home/z/my-project/dev.log 2>&1 &
    SERVER_PID=$!
    echo "$(date): Server PID: $SERVER_PID" >> /tmp/watchdog.log
    sleep 5
  fi
  sleep 2
done
