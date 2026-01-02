import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

// data: Partial<Post> ==>> kisu data thakbe kisu data thakbena tai ata use kora

//data: Omit<Post, "id" | "createdAt" | "updatedAt"  ==>> ai tinta ignore kortechai

const createPost = async (data: Omit<Post, 'id' | 'createdAt ' | 'updatedAt' | 'authorID'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}

const getAllPost = async ({
    search,
    tags,
    isFeatured,
    status,
    authorId
}: {
    search: string | undefined,
    tags: string[] | [],
    isFeatured: boolean | undefined,
    status: PostStatus | undefined,
    authorId: string | undefined
}) => {
    const andConditions: PostWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive'  //capittal or small letter exception
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: 'insensitive'  //capittal or small letter exception
                    }
                }

            ]
        })
    }

    if (tags.length) {
        andConditions.push({
            tags: {
                hasEvery: tags
            }
        })
    }

    if (typeof isFeatured === 'boolean') {
        andConditions.push({
            isFeatured
        })
    }

    if (status) {
        andConditions.push({
            status
        })
    }

    if (authorId) {
        andConditions.push({
            authorId
        })
    }

    const allPost = await prisma.post.findMany({
        where: {
            AND: andConditions
        }
    });
    return allPost;
}

export const postService = {
    createPost,
    getAllPost
}
