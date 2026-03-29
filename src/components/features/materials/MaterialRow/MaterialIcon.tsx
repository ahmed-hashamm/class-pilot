import { FileIconInfo } from "@/lib/utils/fileIcons";

interface MaterialIconProps {
  fileInfo: FileIconInfo;
}

export default function MaterialIcon({ fileInfo }: MaterialIconProps) {
  const Icon = fileInfo.icon;
  
  return (
    <div className={`shrink-0 size-12 rounded-xl flex items-center justify-center border border-transparent transition-all
      ${fileInfo.bg} ${fileInfo.color} group-hover:shadow-inner`}>
      <Icon size={22} className="shrink-0" />
    </div>
  );
}
