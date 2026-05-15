import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.provider';
import { UploadApiResponse } from 'cloudinary';
import type { Multer } from 'multer';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                { folder: 'products'},
                (error: any | undefined, result: UploadApiResponse | undefined) => {
                    if(error) return reject(error);
                    if(!result) return reject(new Error('Cloudinary returned no result'));
                    resolve(result.secure_url);
                }
            );
            upload.end(file.buffer);
        });
    }
}
