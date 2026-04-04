import { FileIconInfo } from "@/lib/utils/fileIcons";

interface MaterialIconProps {
  fileInfo: FileIconInfo;
}

export default function MaterialIcon({ fileInfo }: MaterialIconProps) {
  const Icon = fileInfo.icon;
  
  return (
    <div className={`w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center border-r-2 border-border/80 transition-colors
      ${fileInfo.bg} ${fileInfo.color} group-hover:opacity-80`}>
      <Icon size={28} className="shrink-0" />
    </div>
  );
}
