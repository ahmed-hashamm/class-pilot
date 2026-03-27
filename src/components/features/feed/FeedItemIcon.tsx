import { FEED_ITEM_THEMES } from "@/lib/data/feed";
import { Megaphone } from "lucide-react";

export default function FeedItemIcon({ type, size = 20 }: { type: string; size?: number }) {
  const theme = FEED_ITEM_THEMES[type] || FEED_ITEM_THEMES.announcement;
  const Icon = theme.icon;

  return <Icon size={size} />;
}
