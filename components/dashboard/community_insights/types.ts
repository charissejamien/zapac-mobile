export interface Insight {
  id: string;
  user_id: string;

  category:
    | "Warning"
    | "Shortcuts"
    | "Fare Tips"
    | "Driver Reviews";

  route: string;
  content: string;

  created_at: string;

  profiles: {
    username: string;
    avatar_url: string | null;
  };

  likes: number;
  dislikes: number;
  userReaction: "like" | "dislike" | null;
}
