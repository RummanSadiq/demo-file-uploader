'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Download, Calendar, HardDrive } from 'lucide-react';
import { File } from '../../generated/prisma';

interface ImageModalProps {
    file: File
}

export default function ImageModal({ file }: ImageModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if (!file.fullResolutionKey) return;

        setIsLoading(true);
        try {
            // You'll need to implement a download endpoint that serves the full resolution image
            const response = await fetch(`/api/download/${file.id}`);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                    onClick={openModal}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    View Full Size
                </button>
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="relative max-w-7xl max-h-[90vh] w-full mx-4">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 cursor-pointer"
                        >
                            <X size={24} color='black' />
                        </button>

                        <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
                            <div className="relative max-h-[70vh] overflow-hidden">
                                <Image
                                    src={file.thumbnailUrl || '/placeholder-image.jpg'}
                                    alt={file.name}
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>

                            <div className="p-6 bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{file.name}</h2>
                                        <p className="text-gray-600">{file.type}</p>
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Download size={16} />
                                        )}
                                        {isLoading ? 'Downloading...' : 'Download'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <HardDrive size={16} />
                                        <span>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} />
                                        <span>Uploaded: {new Date(file.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}