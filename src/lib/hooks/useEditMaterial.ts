import { useState } from 'react';
import { updateMaterial } from '@/actions/ClassActions';

interface ExistingFile {
    name: string;
    url: string;
    type?: string;
}

export function useEditMaterial(material: any, onClose: () => void, onSuccess: () => void) {
    const [title, setTitle] = useState(material.title);
    const [description, setDescription] = useState(material.description || '');

    // Map string URLs to object shapes for the UI 
    const [existingFiles, setExistingFiles] = useState<ExistingFile[]>(() => {
        const files = material.files || [];
        return files.map((f: any) => {
            if (typeof f === 'string') {
                const fileName = f.split('/').pop() || 'File';
                const cleanName = fileName.includes('-') ? fileName.split('-').slice(1).join('-') : fileName;
                return { name: cleanName, url: f };
            }
            return f;
        });
    });

    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const removeExistingFile = (index: number) =>
        setExistingFiles(existingFiles.filter((_, i) => i !== index));

    const removeNewFile = (index: number) =>
        setNewFiles(newFiles.filter((_, i) => i !== index));

    const handleSave = async () => {
        if (!title.trim()) { setError('Title is required'); return; }
        setLoading(true); setError(null);

        const formData = new FormData();
        formData.append('materialId', material.id);
        formData.append('classId', material.classId);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('existingFiles', JSON.stringify(existingFiles));
        newFiles.forEach((f) => formData.append('files', f));

        try {
            await updateMaterial(formData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update');
        } finally {
            setLoading(false);
        }
    };

    return {
        title, setTitle,
        description, setDescription,
        existingFiles, removeExistingFile,
        newFiles, setNewFiles, removeNewFile,
        loading, error,
        handleSave
    };
}
