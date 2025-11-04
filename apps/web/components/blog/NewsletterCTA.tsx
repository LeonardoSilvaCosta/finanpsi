"use client";

import { useState } from "react";
import { BlogCategory } from "@prisma/client";
import { BlogEvents } from "@/lib/blog/analytics";

interface NewsletterCTAProps {
  postId?: string;
  location?: string;
  compact?: boolean;
}

export function NewsletterCTA({ postId, location = "post", compact = false }: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/blog/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Inscrição realizada com sucesso! Verifique seu email.");
        setEmail("");
        
        BlogEvents.newsletterSubscribe(email);
        if (postId) {
          BlogEvents.ctaClick(postId, "newsletter", location);
        }
      } else {
        setStatus("error");
        setMessage(data.error || "Erro ao realizar inscrição. Tente novamente.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Erro ao realizar inscrição. Tente novamente.");
    }
  };

  if (compact) {
    return (
      <div className="bg-finansi-primary/5 border border-finansi-primary/20 rounded-lg p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finansi-primary"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-2 bg-finansi-primary text-white rounded-lg hover:bg-finansi-primary/90 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Enviando..." : "Inscrever"}
          </button>
        </form>
        {message && (
          <p className={`mt-2 text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-finansi-primary to-finansi-secondary rounded-xl p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">
          Receba conteúdo exclusivo no seu email
        </h3>
        <p className="text-finansi-primary-50 mb-6">
          Junte-se a milhares de pessoas que estão transformando sua relação com o dinheiro
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-white text-finansi-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Enviando..." : "Inscrever"}
            </button>
          </div>
          
          {message && (
            <p className={`mt-3 text-sm ${status === "success" ? "text-green-200" : "text-red-200"}`}>
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-sm text-finansi-primary-50">
          🔒 Seus dados estão seguros. Não enviamos spam.
        </p>
      </div>
    </div>
  );
}

