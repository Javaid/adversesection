import { useMemo, useState } from "react";

function useEntityModal(getInitialFormData) {
    const initialData = useMemo(() => getInitialFormData(), [getInitialFormData]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const [formData, setFormData] = useState(initialData);

    const openCreate = () => {
        setEditingKey(null);
        setFormData(getInitialFormData());
        setIsModalOpen(true);
    };

    const openEdit = (key, nextFormData) => {
        setEditingKey(key);
        setFormData(nextFormData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const resetModal = () => {
        setEditingKey(null);
        setFormData(getInitialFormData());
        setIsModalOpen(false);
    };

    return {
        closeModal,
        editingKey,
        formData,
        isModalOpen,
        openCreate,
        openEdit,
        resetModal,
        setFormData,
    };
}

export default useEntityModal;