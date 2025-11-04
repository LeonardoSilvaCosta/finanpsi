"use client";

import { useState, useEffect } from "react";
import { BlogPost, BlogCategory, BlogContentType } from "@prisma/client";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { BlogEvents } from "@/lib/blog/analytics";
import { formatCategory } from "@/lib/blog/utils";
import { Search, Filter, X } from "lucide-react";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "all">("all");
  const [selectedContentType, setSelectedContentType] = useState<BlogContentType | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const categories: BlogCategory[] = [
    BlogCategory.FINANCAS_COMPORTAMENTAIS,
    BlogCategory.SAUDE_EMOCIONAL_DINHEIRO,
    BlogCategory.PLANEJAMENTO_PRATICO,
    BlogCategory.TENDENCIAS_MERCADO,
    BlogCategory.CASOS_SUCESSO,
    BlogCategory.GERAL,
  ];

  const contentTypes: BlogContentType[] = [
    BlogContentType.POST,
    BlogContentType.VIDEO,
    BlogContentType.PODCAST,
    BlogContentType.LIVE,
  ];

  // Carregar posts na montagem inicial e quando filtros mudarem
  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedContentType, selectedTag, search]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }
      if (selectedContentType !== "all") {
        params.set("contentType", selectedContentType);
      }
      if (selectedTag) {
        params.set("tag", selectedTag);
      }
      if (search) {
        params.set("search", search);
      }
      params.set("limit", "12");

      const response = await fetch(`/api/blog/posts?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
        setTotal(data.total || 0);
        
        if (search) {
          BlogEvents.blogSearch(search, data.total || 0);
        }
        if (selectedCategory !== "all") {
          BlogEvents.blogFilter("category", selectedCategory);
        }
        if (selectedContentType !== "all") {
          BlogEvents.blogFilter("contentType", selectedContentType);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extrair todas as tags únicas dos posts
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort();

  useEffect(() => {
    BlogEvents.blogPageView(
      selectedCategory !== "all" ? selectedCategory : undefined,
      selectedContentType !== "all" ? selectedContentType : undefined
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog FinanPsi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Conteúdo exclusivo sobre finanças comportamentais, saúde emocional e dinheiro,
            planejamento prático e muito mais.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          {/* Busca */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar artigos, vídeos, podcasts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finansi-primary"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtros de categoria e tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as BlogCategory | "all")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finansi-primary"
              >
                <option value="all">Todas</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategory(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de conteúdo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Conteúdo
              </label>
              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value as BlogContentType | "all")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finansi-primary"
              >
                <option value="all">Todos</option>
                <option value={BlogContentType.POST}>Artigos</option>
                <option value={BlogContentType.VIDEO}>Vídeos</option>
                <option value={BlogContentType.PODCAST}>Podcasts</option>
                <option value={BlogContentType.LIVE}>Lives</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag("")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === ""
                      ? "bg-finansi-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todas
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTag === tag
                        ? "bg-finansi-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum conteúdo encontrado. Tente ajustar os filtros.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {total} {total === 1 ? "resultado encontrado" : "resultados encontrados"}
              </p>
            </div>

            {/* Grid de posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {/* Newsletter CTA */}
        <NewsletterCTA location="blog_list" />
      </div>
    </div>
  );
}

