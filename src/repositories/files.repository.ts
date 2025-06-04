import { db } from "@/lib/db";
import { File } from "../../generated/prisma";

export class FilesRepository {

    async findAll() {
        return await db.file.findMany();
    }

    async findById(id: string) {
        return await db.file.findUnique({
            where: { id },
        });
    }

    async create(data: Omit<File, 'id' | 'createdAt' | 'updatedAt'>) {
        return await db.file.create({
            data,
        });
    }
}