import React from "react";
import { IoWarningOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";

const ConfirmDeleteModal = ({
  isOpen,
  isDeleting,
  deleteResult,
  onConfirm,
  onClose,
  title = "Delete Confirm",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-xl overflow-hidden p-6 text-center space-y-4">
        {!deleteResult ? (
          <>
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <IoWarningOutline className="w-6 h-6 text-red-500 text-xl" style={{ strokeWidth: "36px" }} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
            <div className="flex gap-3 justify-end pt-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <CgSpinner className="animate-spin h-4 w-4 text-white" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${deleteResult.success ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
              {deleteResult.success ? (
                <IoCheckmarkCircleOutline className="w-6 h-6 text-green-500 text-xl" />
              ) : (
                <IoCloseCircleOutline className="w-6 h-6 text-red-500 text-xl" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {deleteResult.success ? "Delete Successful" : "Delete Failed"}
            </h3>
            <p className="text-sm text-slate-500">
              {deleteResult.message}
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
