#!/bin/sh
cat <<EOF > /usr/share/nginx/html/config.json
{
  "VITE_API_URL": "${VITE_API_URL}"
}
EOF
