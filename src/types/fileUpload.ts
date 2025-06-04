export type uploadFileParams = {
    contentType: string;
    key: string;
    file: File
}

export type uploadBufferParams = {
    contentType: string;
    key: string;
    buffer: Buffer;
}

export type generateUploadUrlParams = {
    contentType: string;
    filename: string;
}