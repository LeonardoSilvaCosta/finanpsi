"use client";

import { useState } from "react";
import { BlogComment } from "@prisma/client";
import { formatRelativeDate } from "@/lib/blog/utils";
import { BlogEvents } from "@/lib/blog/analytics";
import { Reply, User } from "lucide-react";

interface CommentItemProps {
  comment: BlogComment & {
    replies?: CommentItemProps["comment"][];
  };
  postId: string;
  onReply?: (parentId: string) => void;
}

function CommentItem({ comment, postId, onReply }: CommentItemProps) {
  return (
    <div className="border-l-2 border-gray-200 pl-4 py-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-finansi-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          {comment.authorUrl ? (
            <img
              src={comment.authorUrl}
              alt={comment.authorName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-finansi-primary" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              {comment.authorName}
            </span>
            <time className="text-xs text-gray-500">
              {formatRelativeDate(comment.createdAt)}
            </time>
          </div>
          
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">
            {comment.content}
          </p>
          
          {onReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-sm text-finansi-primary hover:text-finansi-primary/80 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Responder</span>
            </button>
          )}
          
          {/* Respostas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentsSectionProps {
  comments: (BlogComment & {
    replies?: BlogComment[];
  })[];
  postId: string;
  onReply?: (parentId: string) => void;
}

export function CommentsSection({
  comments,
  postId,
  onReply,
}: CommentsSectionProps) {
  // Separar comentários principais dos replies
  const topLevelComments = comments.filter((c) => !c.parentId);
  const repliesByParent = comments
    .filter((c) => c.parentId)
    .reduce((acc, reply) => {
      if (!acc[reply.parentId!]) {
        acc[reply.parentId!] = [];
      }
      acc[reply.parentId!].push(reply);
      return acc;
    }, {} as Record<string, BlogComment[]>);

  const commentsWithReplies = topLevelComments.map((comment) => ({
    ...comment,
    replies: repliesByParent[comment.id] || [],
  }));

  if (commentsWithReplies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {commentsWithReplies.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSubmit: (data: {
    authorName: string;
    authorEmail: string;
    authorUrl?: string;
    content: string;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    authorUrl: "",
    content: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await onSubmit(formData);
      setStatus("success");
      setMessage("Comentário enviado! Aguardando aprovação.");
      setFormData({
        authorName: "",
        authorEmail: "",
        authorUrl: "",
        content: "",
      });
      
      BlogEvents.commentSubmit(postId, !!parentId);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Erro ao enviar comentário.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {parentId && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            Respondendo a um comentário
          </p>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-finansi-primary mt-2"
            >
              Cancelar resposta
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Seu nome *"
          value={formData.authorName}
          onChange={(e) =>
            setFormData({ ...formData, authorName: e.target.value })
          }
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finansi-primary"
        />
        <input
          type="email"
          placeholder="Seu email *"
          value={formData.authorEmail}
          onChange={(e) =>
            setFormData({ ...formData, authorEmail: e.target.value })
          }
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finansi-primary"
        />
      </div>

      <input
        type="url"
        placeholder="URL do seu site (opcional)"
        value={formData.authorUrl}
        onChange={(e) =>
          setFormData({ ...formData, authorUrl: e.target.value })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finansi-primary"
      />

      <textarea
        placeholder="Seu comentário *"
        value={formData.content}
        onChange={(e) =>
          setFormData({ ...formData, content: e.target.value })
        }
        required
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finansi-primary"
      />

      {message && (
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-2 bg-finansi-primary text-white rounded-lg hover:bg-finansi-primary/90 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Enviando..." : "Enviar comentário"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

