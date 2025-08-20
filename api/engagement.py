from http.server import BaseHTTPRequestHandler
import json
import asyncio
import aiohttp
import re
from urllib.parse import parse_qs
from .scraper import scrape_instagram_data
from .stats import calculate_engagement

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Set CORS headers first
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Get request body
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                response = {"error": "No data received"}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
                
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            username = data.get('username', '').strip().replace('@', '')
            if not username:
                response = {"error": "Username is required"}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            
            # Run scraper to fetch real data
            try:
                # Execute the async scraper
                followers, likes_list, comments_list = asyncio.run(scrape_instagram_data(username))
            except RuntimeError:
                # Fallback if an event loop is already running
                loop = asyncio.get_event_loop()
                followers, likes_list, comments_list = loop.run_until_complete(scrape_instagram_data(username))

            if not followers or not likes_list:
                response = {"error": "Failed to fetch engagement data. Profile may be private or unavailable."}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return

            avg_likes = int(sum(likes_list) / len(likes_list)) if likes_list else 0
            avg_comments = int(sum(comments_list) / len(comments_list)) if comments_list else 0
            engagement_rate = calculate_engagement(followers, likes_list, comments_list)

            result = {
                "username": username,
                "followers": followers,
                "avgLikes": avg_likes,
                "avgComments": avg_comments,
                "engagementRate": str(engagement_rate)
            }

            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON data")
        except Exception as e:
            self.send_error_response(500, f"Server error: {str(e)}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {"error": message}
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
