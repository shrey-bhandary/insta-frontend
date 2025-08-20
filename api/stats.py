def calculate_engagement(followers: int, likes_list: list, comments_list: list):
    """Simple engagement calculation - formerly in utils.py"""
    if followers == 0 or not likes_list:
        return 0.0
    avg_likes = sum(likes_list) / len(likes_list)
    avg_comments = sum(comments_list) / len(comments_list)
    return round(((avg_likes + avg_comments) / followers) * 100, 2)

def get_detailed_stats(followers: int, likes_list: list, comments_list: list):
    """Detailed statistics calculation - formerly calculate_engagement_stats"""
    if not likes_list or not comments_list:
        return None
    
    avg_likes = sum(likes_list) / len(likes_list)
    avg_comments = sum(comments_list) / len(comments_list)
    engagement_rate = round(((avg_likes + avg_comments) / followers) * 100, 2)
    
    return {
        'followers': followers,
        'avg_likes': avg_likes,
        'avg_comments': avg_comments,
        'engagement_rate': engagement_rate
    }

#...existing format_number and print_stats functions...
