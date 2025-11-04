"use client";

import { CommentForm } from "@/components/blog/Comments";
import { submitComment } from "./actions";

interface CommentFormClientProps {
  postId: string;
}

export function CommentFormClient({ postId }: CommentFormClientProps) {
  const handleSubmit = async (data: {
    authorName: string;
    authorEmail: string;
    authorUrl?: string;
    content: string;
  }) => {
    await submitComment({
      postId,
      ...data,
    });
  };

  return <CommentForm postId={postId} onSubmit={handleSubmit} />;
}

