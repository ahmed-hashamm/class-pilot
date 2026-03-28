import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { updateClassSettings, deleteClass } from "@/actions/ClassActions";

export function useClassSettings(isOpen: boolean, onClose: () => void, classData: any) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [settings, setSettings] = useState({ showClassCode: true });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && classData) {
      setName(classData.name || "");
      setDescription(classData.description || "");
      const showCodeValue = classData.settings?.showClassCode;
      setSettings({ 
        showClassCode: typeof showCodeValue === 'boolean' ? showCodeValue : true 
      });
    }
  }, [isOpen, classData]);

  const handleToggleSetting = (key: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!classData?.id) return;
    setIsSaving(true);
    try {
      const res = await updateClassSettings({
        classId: classData.id,
        name: name.trim(),
        description: description.trim(),
        settings
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Settings updated successfully");
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!classData?.id) return;
    setIsDeleting(true);
    try {
      const res = await deleteClass(classData.id);
      if (res.error) {
        toast.error(res.error);
        setShowDeleteConfirm(false);
      } else {
        toast.success("Class deleted successfully");
        onClose();
        router.push("/dashboard");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    name, setName,
    description, setDescription,
    settings, handleToggleSetting,
    isSaving, isDeleting,
    showDeleteConfirm, setShowDeleteConfirm,
    handleSave, handleDelete
  };
}
