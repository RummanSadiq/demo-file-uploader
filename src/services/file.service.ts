"use server"

import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    S3ServiceException,
    type PutObjectCommandInput,
    type S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { awsConfig } from '@/configs/aws.config';
import type { uploadFileParams, uploadBufferParams, generateUploadUrlParams } from '@/types/fileUpload';

const s3ClientOptions: S3ClientConfig = {
    region: awsConfig.region,
};

// Only add explicit credentials in development environments
if (process.env.NODE_ENV === 'development' &&
    process.env.AWS_ARCHITECTURE === 'true' &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY) {
    s3ClientOptions.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
}

const s3Client = new S3Client(s3ClientOptions);

export const uploadFile = async ({ key, contentType, file }: uploadFileParams): Promise<string> => {
    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const params: PutObjectCommandInput = {
            Bucket: awsConfig.bucket,
            Key: key,
            ContentType: contentType,
            Body: fileBuffer,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;
    } catch (error: unknown) {
        if (error instanceof S3ServiceException) {
            throw new Error(`S3 upload failed: ${error.message}`);
        }
        throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const uploadBuffer = async ({ key, contentType, buffer }: uploadBufferParams): Promise<string> => {
    try {
        const params: PutObjectCommandInput = {
            Bucket: awsConfig.bucket,
            Key: key,
            ContentType: contentType,
            Body: buffer,
            // ACL: 'public-read',
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;
    } catch (error) {
        if (error instanceof S3ServiceException) {
            throw new Error(`S3 upload failed: ${error.message}`);
        }
        throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const generateUploadUrl = async ({ contentType, filename }: generateUploadUrlParams) => {

    const randomId = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `uploads/${randomId}-${sanitizedFileName}`;

    const putObjectCommand = new PutObjectCommand({
        Bucket: awsConfig.bucket,
        Key: key,
        ContentType: contentType,
        // ACL: 'public-read',
    });

    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 300,
    });

    return {
        uploadUrl: presignedUrl,
        url: `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${key}`
    };
}

export const downloadFile = async (key: string): Promise<Buffer> => {
    try {
        const getObjectCommand = new GetObjectCommand({
            Bucket: awsConfig.bucket,
            Key: key,
        });

        const s3Response = await s3Client.send(getObjectCommand);
        
        if (!s3Response.Body) {
            throw new Error('File content not found in S3');
        }

        // Convert stream to buffer
        const chunks: Uint8Array[] = [];
        const reader = s3Response.Body.transformToWebStream().getReader();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }
        
        return Buffer.concat(chunks);

    } catch (error) {
        if (error instanceof S3ServiceException) {
            throw new Error(`S3 download failed: ${error.message}`);
        }
        throw new Error(`File download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}