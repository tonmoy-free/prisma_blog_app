import { Request, Response } from "express";
import { postService } from "./post.service";
import { error } from "node:console";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postService.createPost(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json(
            {
                error: "Post creation failed",
                details: e
            })
    }
}


export const PostController = {
    createPost
}