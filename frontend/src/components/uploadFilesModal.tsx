import { useRef, useState, type ChangeEvent, type FormEvent, type DragEvent } from 'react';
import ImageUpload from '../assets/upload-file.webp';
// import axios from 'axios';
import toast from 'react-hot-toast';
import SuccessAlert from './toastAlerts/successAlert';
// import InformationAlert from './toastAlerts/informationAlert';
import ErrorAlert from './toastAlerts/errorAlert';
import ModalContainer from './ui/modalContainer';
import XIcon from './ui/icons/xIcon';
import { useUploadQuestions } from '../hooks/mutations/questionMutations';

interface UploadModalProps {
    handleCloseModal: () => void;
}

const UploadFilesModal: React.FC<UploadModalProps> = ({ handleCloseModal }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: uploadQuestions } = useUploadQuestions()

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        uploadQuestions(formData, {
            onSuccess: () => {
                toast.custom((t) => (
                    <SuccessAlert
                        t={t}
                        title="Success"
                        description="File uploaded successfully!"
                    />
                ));
            },
            onError: (error: any) => { 
                toast.custom((t) => (
                    <ErrorAlert
                        t={t}
                        title="Error"
                        description={error.response?.data?.message || "Failed to upload file."}
                    />
                ));
                handleCloseModal();
            }
        })
    }

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFile(null);
    };

    return (
        <ModalContainer
            handleCloseModal={handleCloseModal}>
            <section className="flex flex-col sm:p-4 w-full">
                <header>
                    <h2 className="text-xl font-medium text-white">Upload a File</h2>
                    <p className="text-sm text-slate-400">Attach the file below</p>
                    <p className="text-sm text-red-400">Please ensure there are no empty cells in your file.</p>
                </header>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        {file ? (
                            <div className={`cursor-pointer flex flex-col items-center justify-center min-w-xs w-full h-60 border-4 border-dashed rounded-lg  p-5 text-center transition-colors ease-in-out duration-200 border-violet-200`}>
                                <div className="flex flex-col items-center">
                                    <div className="relative bg-dashboard-bg border-dashboard-border border p-5 rounded-lg shadow z-20">
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="absolute top-1 right-1 text-slate-500 transition-colors hover:text-white cursor-pointer"
                                        >
                                            <XIcon className="size-4" />
                                        </button>
                                        <svg
                                            fill="#5eead4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="25"
                                            height="25"
                                            viewBox="0 0 50 50"
                                        >
                                            <path
                                                d="M28.8125 .03125L.8125 5.34375C.339844 5.433594 0 5.863281 0 6.34375L0 43.65625C0 44.136719 .339844 44.566406 .8125 44.65625L28.8125 49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold mt-2 text-center text-teal-300 break-all">
                                        {file.name}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <label
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onDragLeave={handleDragLeave}
                                className={`cursor-pointer flex flex-col items-center justify-center min-w-xs w-full h-60 border-4 border-dashed rounded-lg  p-5 text-center transition-colors ease-in-out duration-200 ${isDragging ? 'border-dashboard-border bg-dashboard-bg' : 'border-violet-200'}`}
                            >

                                <div className="flex flex-col items-center">
                                    <img src={ImageUpload} alt="upload" className="h-32 object-contain" />
                                    <p className="text-sm font-semibold text-slate-400">
                                        Drag and drop a <span className="text-violet-500">file</span> here
                                        <br />or <span className="text-violet-500 underline">select a file</span>
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".xlsx,.xls"
                                />
                            </label>
                        )
                        }
                        <p className="text-xs text-slate-400 mt-1">Allowed file types: xls, xlsx</p>
                    </div>

                    <footer className="flex justify-center">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-dashboard-border/50 hover:bg-dashboard-border/80 text-white rounded-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Upload
                        </button>
                    </footer>
                </form>
            </section>
        </ModalContainer>
    );
};

export default UploadFilesModal;
