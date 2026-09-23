#!/usr/bin/env python3
"""
EduTrack Backend Keep-Alive Script
----------------------------------
Prevents free-tier backends (e.g. Render, Koyeb, Railway, Heroku) from going to sleep.
Periodically pings the target URL health check endpoint.

Usage:
    python keep_alive.py [--url URL] [--interval SECONDS]

Example:
    python keep_alive.py --url https://edutrack-backend.onrender.com/health --interval 600
"""

import sys
import time
import argparse
import urllib.request
import urllib.error
from datetime import datetime

# Safe stdout UTF-8 handling for Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def ping_backend(url: str) -> bool:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "EduTrack-KeepAlive-Script/1.0"}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            if response.status == 200:
                print(f"[{timestamp}] [OK] Keep-alive ping SUCCESS ({url}) - HTTP 200 OK")
                return True
            else:
                print(f"[{timestamp}] [WARN] Keep-alive ping returned status: {response.status}")
                return False
    except urllib.error.HTTPError as e:
        print(f"[{timestamp}] [ERROR] Keep-alive HTTP error: {e.code} {e.reason}")
    except urllib.error.URLError as e:
        print(f"[{timestamp}] [ERROR] Keep-alive connection error: {e.reason}")
    except Exception as e:
        print(f"[{timestamp}] [ERROR] Unexpected ping error: {e}")
    return False

def main():
    parser = argparse.ArgumentParser(description="EduTrack Backend Keep-Alive Pinger")
    parser.add_argument(
        "--url",
        default="http://localhost:8000/health",
        help="Target backend health URL (e.g. https://your-backend.onrender.com/health)"
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=600,
        help="Ping interval in seconds (default: 600 seconds / 10 minutes)"
    )
    parser.add_argument(
        "--once",
        action="store_true",
        help="Ping once and exit immediately"
    )

    args = parser.parse_args()

    print("=" * 65)
    print("=== EduTrack Backend Keep-Alive Pinger Initialized ===")
    print(f"Target URL: {args.url}")
    print(f"Interval  : {args.interval} seconds ({args.interval // 60} minutes)")
    print("=" * 65)

    if args.once:
        success = ping_backend(args.url)
        sys.exit(0 if success else 1)

    # Initial ping
    ping_backend(args.url)

    try:
        while True:
            time.sleep(args.interval)
            ping_backend(args.url)
    except KeyboardInterrupt:
        print("\nKeep-alive pinger stopped by user.")
        sys.exit(0)

if __name__ == "__main__":
    main()
