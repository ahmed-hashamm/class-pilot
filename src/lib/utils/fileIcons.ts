import { 
  FileText, 
  FileImage, 
  FileCode, 
  Globe, 
  File,
  LucideIcon
} from "lucide-react";

export interface FileIconInfo {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const getFileIcon = (fileName: string): FileIconInfo => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
    return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' };
  }
  
  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) {
    return { icon: FileImage, color: 'text-purple-500', bg: 'bg-purple-50' };
  }
  
  if (['js', 'ts', 'tsx', 'py', 'json', 'html', 'css'].includes(ext || '')) {
    return { icon: FileCode, color: 'text-orange-500', bg: 'bg-orange-50' };
  }
  
  if (fileName.startsWith('http')) {
    return { icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50' };
  }
  
  return { icon: File, color: 'text-navy', bg: 'bg-secondary' };
};
