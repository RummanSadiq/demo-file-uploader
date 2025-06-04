'use client'

import { Download } from 'lucide-react';
import { useState } from 'react';
import { File } from '../../generated/prisma';

const DownloadImage = ({ file }: { file: File }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if (!file.fullResolutionKey) return;

        setIsLoading(true);
        try {
            // You'll need to implement a download endpoint that serves the full resolution image
            const response = await fetch(`/api/file-download/${file.id}`);
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
    return (
        <button
            onClick={handleDownload}
            disabled={isLoading}
            className="mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-1 rounded-lg transition-colors w-full"
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                <Download size={16} />
            )}
            {isLoading ? 'Downloading...' : 'Download'}
        </button>
    )
}

export default DownloadImage