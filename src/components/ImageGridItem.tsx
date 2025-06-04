import Image from 'next/image';
import { File } from '../../generated/prisma';
import DownloadImage from './DownloadImage';

const ImageGridItem = ({ file }: { file: File }) => {
    
    return (
        <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-square relative">
                <Image
                    src={file.thumbnailUrl || '/placeholder-image.jpg'}
                    alt={file.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
            </div>

            <div className="p-4">
                <h3 className="font-medium text-gray-800 truncate" title={file.name}>
                    {file.name}
                </h3>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                </div>
                <DownloadImage file={file} />
            </div>

            {/* <ImageModal file={file} /> */}
        </div>
    )
}

export default ImageGridItem