def calculate_engagement(followers: int, likes_list: list, comments_list: list) -> float:
    # Basic input validation
    if not followers or followers <= 0:
        print("[DEBUG] Invalid followers count")
        return 0.0
    if not likes_list or not comments_list:
        print("[DEBUG] Empty engagement lists")
        return 0.0
        
    # Filter out zeros and invalid values
    valid_likes = [l for l in likes_list if isinstance(l, (int, float)) and l > 0]
    valid_comments = [c for c in comments_list if isinstance(c, (int, float)) and c > 0]
    
    if not valid_likes or not valid_comments:
        print("[DEBUG] No valid engagement data")
        return 0.0
        
    # Calculate averages safely
    avg_likes = sum(valid_likes) / len(valid_likes)
    avg_comments = sum(valid_comments) / len(valid_comments)
    
    return round(((avg_likes + avg_comments) / followers) * 100, 2)