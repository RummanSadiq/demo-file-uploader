import ImageGridItem from '@/components/ImageGridItem';
import { FilesRepository } from '@/repositories/files.repository';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const filesRepository = new FilesRepository();

export default async function Home() {
  const files = await filesRepository.findAll();

  if (!files || files.length === 0) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No images found</h2>
          <p className="text-gray-500">Upload some images to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Image Gallery</h1>
          <Link 
            href="/upload"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Upload Images
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {files.map((file) => (
            <ImageGridItem key={file.id} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}