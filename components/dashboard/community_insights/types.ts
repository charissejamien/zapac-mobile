export interface Insight {
  id: string;

  userName: string;
  avatar: string;

  category:
    | "All"
    | "Warning"
    | "Shortcuts"
    | "Fare Tips"
    | "Driver Reviews";

  route: string;
  timeAgo: string;

  content: string;

  likes: number;
  dislikes: number;
}