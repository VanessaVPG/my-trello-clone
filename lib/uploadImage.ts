import { ID, storage  } from "@/appwrite";


export const uploadImage = async (file: File) => {
    if(!file) return;

    const fileUploaded = await storage.createFile(
        "64d1144a0f0a7426d690",
        ID.unique(),
        file,
    );
    return fileUploaded;
}
