import aiohttp
import re
import asyncio
import json
from bs4 import BeautifulSoup

async def scrape_instagram_data(username: str, post_limit: int = 30, max_retries: int = 3):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'X-IG-App-ID': '936619743392459'
    }

    async with aiohttp.ClientSession(headers=headers) as session:
        for attempt in range(max_retries):
            try:
                async with session.get(f'https://i.instagram.com/api/v1/users/web_profile_info/?username={username}') as response:
                    print(f"[DEBUG] Attempt {attempt + 1}, Status: {response.status}")
                    
                    if response.status == 200:
                        try:
                            raw_text = await response.text()
                            data = json.loads(raw_text)
                            
                            # Handle different response formats
                            if data.get('status') == 'ok':
                                # Try alternate data path for newer API format
                                user_data = data.get('data', {}).get('user', {})
                                if not user_data:
                                    # Try alternate endpoint for media data
                                    media_response = await session.get(
                                        f'https://i.instagram.com/api/v1/feed/user/{username}/username/',
                                        headers={'X-IG-App-ID': '936619743392459'}
                                    )
                                    media_data = await media_response.json()
                                    user_data = media_data.get('user', {})
                            else:
                                user_data = data.get('data', {}).get('user', {})

                            if not user_data:
                                print(f"[DEBUG] No user data found in response: {raw_text[:200]}")
                                continue

                            followers = int(user_data.get('follower_count', user_data.get('edge_followed_by', {}).get('count', 0)))
                            if not followers:
                                continue
                                
                            print(f"[DEBUG] Raw followers: {followers}")
                            
                            # Get posts with better error handling
                            posts = user_data.get('edge_owner_to_timeline_media', {}).get('edges', [])
                            if not posts:
                                posts = user_data.get('items', [])
                            
                            print(f"[DEBUG] Posts found: {len(posts)}")
                            
                            likes_list = []
                            comments_list = []
                            
                            for post in posts[:post_limit]:
                                try:
                                    node = post.get('node', post)  # Handle both API formats
                                    likes = node.get('like_count', node.get('edge_liked_by', {}).get('count', 0))
                                    comments = node.get('comment_count', node.get('edge_media_to_comment', {}).get('count', 0))
                                    
                                    print(f"[DEBUG] Post engagement - likes: {likes}, comments: {comments}")
                                    
                                    if likes > 0:
                                        likes_list.append(likes)
                                    if comments > 0:
                                        comments_list.append(comments)
                                except Exception as e:
                                    print(f"[DEBUG] Error processing post: {e}")
                                    continue
                            
                            if likes_list and comments_list:
                                return followers, likes_list, comments_list
                                
                        except json.JSONDecodeError as e:
                            print(f"[DEBUG] JSON decode error: {e}")
                            
                    await asyncio.sleep(2 ** attempt)
                    
            except Exception as e:
                print(f"[ERROR] Attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2)
                    continue
                    

        return 0, [], []
