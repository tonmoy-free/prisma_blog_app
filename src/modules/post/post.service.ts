import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// data: Partial<Post> ==>> kisu data thakbe kisu data thakbena tai ata use kora

//data: Omit<Post, "id" | "createdAt" | "updatedAt"  ==>> ai tinta ignore kortechai

const createPost = async (data: Omit<Post, 'id' | 'createdAt ' | 'updatedAt'>) => {
    const result = await prisma.post.create({
        data
    })
    return result;
}

export const postService = {
    createPost
}
