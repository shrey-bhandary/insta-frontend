from http.server import BaseHTTPRequestHandler
import json
import asyncio
from .scraper import scrape_instagram_data
from .stats import calculate_engagement


class handler(BaseHTTPRequestHandler):

    def send_json(self, status, payload):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                return self.send_json(400, {"error": "No data received"})

            body_raw = self.rfile.read(content_length)
            data = json.loads(body_raw.decode('utf-8'))

            username = data.get("username", "").strip().replace("@", "")
            if not username:
                return self.send_json(400, {"error": "Username is required"})

            # Execute scraper (handles both cases: event loop already running or not)
            try:
                followers, likes_list, comments_list = asyncio.run(
                    scrape_instagram_data(username)
                )
            except RuntimeError:
                loop = asyncio.get_event_loop()
                followers, likes_list, comments_list = loop.run_until_complete(
                    scrape_instagram_data(username)
                )

            # Followers must exist; 0 means private/unavailable
            if followers < 1:
                return self.send_json(
                    400,
                    {"error": "Unable to fetch followers. Profile may be private, restricted, or unavailable."}
                )

            # No posts found at all
            if len(likes_list) == 0 and len(comments_list) == 0:
                return self.send_json(
                    400,
                    {"error": "No posts found for engagement calculation."}
                )

            # Calculate averages safely
            avg_likes = int(sum(likes_list) / len(likes_list)) if len(likes_list) > 0 else 0
            avg_comments = int(sum(comments_list) / len(comments_list)) if len(comments_list) > 0 else 0

            # Handle engagement gracefully
            try:
                engagement_rate = calculate_engagement(followers, likes_list, comments_list)
            except Exception:
                engagement_rate = "0.00"

            result = {
                "username": username,
                "followers": followers,
                "avgLikes": avg_likes,
                "avgComments": avg_comments,
                "engagementRate": str(engagement_rate)
            }

            return self.send_json(200, result)

        except json.JSONDecodeError:
            return self.send_json(400, {"error": "Invalid JSON payload"})

        except Exception as e:
            return self.send_json(500, {"error": f"Server error: {str(e)}"})

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()