'use server'

import { FilesRepository } from '@/repositories/files.repository';
import { uploadBuffer, uploadFile } from '@/services/file.service';
import sharp from 'sharp';
import { File as _File } from '../../generated/prisma';
import { revalidatePath } from 'next/cache';

const filesRepository = new FilesRepository();

export const handleFileUpload = async (formData: FormData) => {
    try {
        const file = formData.get('file') as File | null;

        if (!file) {
            return {
                success: false,
                error: 'No file provided'
            };
        }

        if (!file.type.startsWith('image/')) {
            return {
                success: false,
                error: 'Please select a valid image file'
            };
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return {
                success: false,
                error: 'File size must be less than 10MB'
            };
        }

        const contentType = file.type || 'application/octet-stream';
        const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const originalKey = `full-resolution/${key}`;
        const thumbnailKey = `thumbnails/${key}`;

        let thumbnailBuffer: Buffer;
        try {
            thumbnailBuffer = await sharp(await file.arrayBuffer())
                .resize(200, 200, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80 })
                .toBuffer();
        } catch (error) {
            console.error('Thumbnail generation failed:', error);
            return {
                success: false,
                error: 'Failed to process image. Please try with a different image.'
            };
        }

        try {
            const [originalUrl, thumbnailUrl] = await Promise.all([
                uploadFile({ key: originalKey, contentType, file }),
                uploadBuffer({ key: thumbnailKey, contentType, buffer: thumbnailBuffer })
            ]);

            const fileData: Omit<_File, 'id' | 'createdAt' | 'updatedAt'> = {
                name: file.name,
                size: file.size,
                type: file.type,
                thumbnailKey: thumbnailKey,
                thumbnailUrl: thumbnailUrl,
                fullResolutionKey: originalKey
            }

            await filesRepository.create(fileData)
            revalidatePath('/');
            return {
                success: true,
                data: {
                    originalUrl,
                    thumbnailUrl,
                    fileName: file.name,
                    fileSize: file.size
                }
            };

        } catch (uploadError) {
            console.error('Upload failed:', uploadError);
            return {
                success: false,
                error: 'Failed to upload file. Please try again.'
            };
        }

    } catch (error) {
        console.error('Unexpected error in handleFileUpload:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        };
    }
}