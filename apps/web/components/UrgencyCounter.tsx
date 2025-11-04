"use client";

import { useEffect, useState } from "react";

interface UrgencyCounterProps {
  totalSlots?: number;
  baseCount?: number;
}

export default function UrgencyCounter({ 
  totalSlots = 100,
  baseCount = 0 
}: UrgencyCounterProps) {
  const [currentCount, setCurrentCount] = useState(baseCount);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar contagem real da API
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/stats/subscribers");
        if (response.ok) {
          const data = await response.json();
          setCurrentCount(data.count || baseCount);
        }
      } catch (error) {
        console.error("Erro ao buscar contagem:", error);
        // Manter valor base em caso de erro
        setCurrentCount(baseCount);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();

    // Atualizar contagem a cada 30 segundos
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, [baseCount]);

  const remainingSlots = totalSlots - currentCount;
  const percentageUsed = Math.min((currentCount / totalSlots) * 100, 100);
  const isLowStock = remainingSlots <= 20;

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-primary shadow-lg">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-accent-brown text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0ZM8 14.4C4.472 14.4 1.6 11.528 1.6 8C1.6 4.472 4.472 1.6 8 1.6C11.528 1.6 14.4 4.472 14.4 8C14.4 11.528 11.528 14.4 8 14.4ZM8.8 4V7.2L11.2 8.8L10.4 9.6L7.6 7.6V4H8.8Z"
              fill="currentColor"
            />
          </svg>
          Vagas Limitadas
        </div>
        
        <h3 className="text-2xl font-bold text-finansi-primary mb-2">
          {loading ? (
            <span className="inline-block animate-pulse">Carregando...</span>
          ) : (
            <>
              {currentCount.toLocaleString('pt-BR')} já se inscreveram
            </>
          )}
        </h3>
        
        <p className="text-finansi-secondary text-sm mb-4">
          Restam apenas{" "}
          <span className={`font-bold ${isLowStock ? 'text-destructive' : 'text-primary'}`}>
            {remainingSlots} vagas
          </span>{" "}
          para o teste piloto
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-500 ease-out"
            style={{ width: `${percentageUsed}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-finansi-tertiary mt-1">
          <span>{currentCount} inscritos</span>
          <span>{totalSlots} vagas totais</span>
        </div>
      </div>

      {/* Aviso de urgência */}
      {isLowStock && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
          <p className="text-destructive text-sm font-medium">
            ⚠️ Últimas vagas disponíveis! Garanta sua participação agora.
          </p>
        </div>
      )}

      {/* Mensagem de último minuto */}
      {remainingSlots <= 10 && (
        <div className="mt-3 text-center">
          <p className="text-xs text-finansi-tertiary">
            🔥 Últimas {remainingSlots} vagas! Inscrições encerram em breve.
          </p>
        </div>
      )}
    </div>
  );
}

