"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profession: string | null;
  challenge: string | null;
  groupAccepted: boolean;
  diagnosis: string | null;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    profession: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  async function fetchLeads() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.profession) params.append("profession", filters.profession);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Erro ao carregar leads");
      }

      const data = await res.json();
      setLeads(data.leads || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao carregar leads:", err);
    } finally {
      setLoading(false);
    }
  }

  // Obter profissões únicas para filtro
  const uniqueProfessions = Array.from(
    new Set(leads.map((lead) => lead.profession).filter(Boolean))
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard de Leads</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize todos os leads cadastrados
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Nome ou email..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profissão</label>
              <select
                value={filters.profession}
                onChange={(e) =>
                  setFilters({ ...filters, profession: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Todas</option>
                {uniqueProfessions.map((prof) => (
                  <option key={prof} value={prof || ""}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Inicial</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Final</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">{leads.length}</div>
            <div className="text-sm text-muted-foreground">Total de Leads</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">
              {leads.filter((l) => l.groupAccepted).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Interessados em Grupo
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">
              {leads.filter((l) => l.diagnosis).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Com Diagnóstico
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">
              {uniqueProfessions.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Profissões Únicas
            </div>
          </div>
        </div>

        {/* Tabela de Leads */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando leads...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum lead encontrado</p>
          </div>
        ) : (
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Telefone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Profissão</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Grupo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Data</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-t">
                      <td className="px-4 py-3">{lead.name}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-primary hover:underline"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">{lead.phone || "-"}</td>
                      <td className="px-4 py-3">{lead.profession || "-"}</td>
                      <td className="px-4 py-3">
                        {lead.groupAccepted ? (
                          <span className="text-green-600">✓ Sim</span>
                        ) : (
                          <span className="text-muted-foreground">Não</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            // Expandir para ver detalhes
                            alert(
                              `Desafio: ${lead.challenge || "N/A"}\n\nDiagnóstico: ${
                                lead.diagnosis ? lead.diagnosis.substring(0, 100) + "..." : "N/A"
                              }`
                            );
                          }}
                          className="text-primary hover:underline text-sm"
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

