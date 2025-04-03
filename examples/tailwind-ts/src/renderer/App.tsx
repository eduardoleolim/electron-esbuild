import React, { useRef } from "react";

export function App(): React.JSX.Element {
    const dialogRef = useRef<HTMLDialogElement>(null);

    function showModal() {
        dialogRef.current?.showModal();
    }

    function closeModal() {
        dialogRef.current?.close();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-scren bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Hello Electron</h1>

            <dialog 
                ref={dialogRef}
                className="m-auto w-auto max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200 "
            >
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Dialog</h2>
                <p className="text-gray-600 mb-4">This is a dialog message</p>
                <button 
                    onClick={closeModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Close
                </button>
            </dialog>

            <button 
                className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition"
                onClick={showModal}
            >
                Open modal
            </button>
        </div>
    );
}