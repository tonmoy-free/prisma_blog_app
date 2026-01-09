import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
}) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.postId
            }
        })
    }
    return await prisma.comment.create({
        data: payload
    })
};

const getCommentByID = async (id: string) => {
    return await prisma.comment.findUnique({
        where: {
            id
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })
}

const getCommentsByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}

//1.nijer comment delete korte parbe
//login thakte hobe
//tar nijer comment ki na check korte hobe
const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }

    })
    if (!commentData) {
        throw new Error("Your provided inpt is invalied")
    }

    return await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })
}


//authorId, commentId, updateddata
const updateComment = async (commentId: string, data: { content?: string, status?: CommentStatus }, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }

    })
    if (!commentData) {
        throw new Error("Your provided inpt is invalied")
    }

    return await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })
}

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    });

    if (commentData.status === data.status) {
        throw new Error(`Your Provided status (${data.status}) is already up to date.`)
    }

    return await prisma.comment.update({
        where: {
            id
        },
        data
    })
}

export const CommentService = {
    createComment,
    getCommentByID,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}