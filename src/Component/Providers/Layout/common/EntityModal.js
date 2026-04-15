import React from "react";

function EntityModal({
    isOpen,
    title,
    onClose,
    onSave,
    saveLabel = "Save",
    cancelLabel = "Cancel",
    widthClassName = "w-96",
    bodyClassName = "",
    children,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className={`bg-white p-6 rounded-lg ${widthClassName}`}>
                <h3 className="text-lg font-semibold mb-4">{title}</h3>

                <div className={bodyClassName}>{children}</div>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
                        {cancelLabel}
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onSave}>
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EntityModal;