"use client";

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  Lock,
  Clock,
  Users,
  FileCheck,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: "privacy" | "process" | "community" | "results";
}

const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "Meus dados estão seguros? Como funciona o sigilo?",
    answer:
      "Sim, seus dados estão 100% protegidos. Seguimos a LGPD (Lei Geral de Proteção de Dados) rigorosamente. Todas as informações são criptografadas e armazenadas em servidores seguros. Seus dados pessoais nunca são compartilhados com terceiros sem sua autorização expressa. Além disso, você pode solicitar a exclusão de suas informações a qualquer momento através do nosso canal de atendimento.",
    icon: <Shield className="w-5 h-5" />,
    category: "privacy",
  },
  {
    id: "faq-2",
    question: "Como meus dados serão utilizados?",
    answer:
      "Seus dados são utilizados exclusivamente para gerar seu diagnóstico financeiro personalizado e para melhorar nossos serviços. Utilizamos as informações para entender seu perfil financeiro, identificar padrões de comportamento com o dinheiro e criar recomendações específicas para sua situação. Nenhum dado é vendido ou compartilhado para fins comerciais. Você mantém total controle sobre suas informações.",
    icon: <Lock className="w-5 h-5" />,
    category: "privacy",
  },
  {
    id: "faq-3",
    question: "Quanto tempo leva para receber o diagnóstico?",
    answer:
      "Seu diagnóstico é gerado instantaneamente! Assim que você completar o formulário e enviar suas respostas, nosso sistema processa suas informações em tempo real. Você receberá o relatório completo imediatamente na tela e também por email. O processo todo leva apenas 3-5 minutos para preencher o formulário e você já tem acesso ao diagnóstico.",
    icon: <Clock className="w-5 h-5" />,
    category: "process",
  },
  {
    id: "faq-4",
    question: "O diagnóstico é realmente gratuito?",
    answer:
      "Sim, o diagnóstico financeiro é 100% gratuito, sem pegadinhas ou cobranças escondidas. Acreditamos que todos merecem acesso a orientação financeira de qualidade. Após receber seu diagnóstico, você pode optar por serviços adicionais como consultoria personalizada ou cursos, mas isso é totalmente opcional. O relatório completo e as recomendações iniciais são totalmente gratuitos.",
    icon: <FileCheck className="w-5 h-5" />,
    category: "results",
  },
  {
    id: "faq-5",
    question: "Como funciona a comunidade VIP no WhatsApp?",
    answer:
      "A comunidade VIP é um grupo exclusivo no WhatsApp onde você terá acesso a conteúdos semanais sobre educação financeira, dicas práticas, desafios motivacionais e suporte de outros membros que também estão transformando sua relação com o dinheiro. Além disso, você receberá primeiro acesso a novos materiais, webinars ao vivo e poderá tirar dúvidas diretamente com nossa equipe. É um espaço seguro e acolhedor para sua jornada financeira.",
    icon: <Users className="w-5 h-5" />,
    category: "community",
  },
  {
    id: "faq-6",
    question: "Preciso compartilhar informações bancárias?",
    answer:
      "Não! Você não precisa fornecer senhas, dados de cartão de crédito ou acessos bancários. O diagnóstico é baseado em perguntas sobre seu comportamento financeiro, seus desafios e objetivos. Queremos entender sua relação com o dinheiro, não acessar suas contas. Todas as informações solicitadas são de caráter comportamental e situacional.",
    icon: <Lock className="w-5 h-5" />,
    category: "privacy",
  },
  {
    id: "faq-7",
    question: "O diagnóstico substitui um profissional de finanças?",
    answer:
      "O diagnóstico é uma ferramenta poderosa de autoconhecimento e orientação inicial, mas não substitui um acompanhamento profissional personalizado. Ele fornece insights valiosos, identifica padrões e oferece recomendações baseadas em seu perfil. Para situações complexas ou acompanhamento contínuo, recomendamos consultar um profissional certificado. Podemos indicar parceiros qualificados após você receber seu diagnóstico.",
    icon: <Sparkles className="w-5 h-5" />,
    category: "results",
  },
  {
    id: "faq-8",
    question: "Posso fazer o diagnóstico mais de uma vez?",
    answer:
      "Sim! Você pode refazer o diagnóstico sempre que quiser acompanhar sua evolução financeira. Recomendamos refazer a cada 3-6 meses para monitorar seu progresso e ajustar as estratégias conforme sua situação muda. Cada novo diagnóstico fica salvo no seu histórico, permitindo que você compare resultados e veja sua transformação ao longo do tempo.",
    icon: <FileCheck className="w-5 h-5" />,
    category: "process",
  },
  {
    id: "faq-9",
    question: "E se eu não gostar do diagnóstico ou discordar?",
    answer:
      "O diagnóstico é baseado nas informações que você fornece e em padrões comportamentais identificados. Se você sentir que algo não faz sentido, pode ser que algumas respostas precisem de ajuste - você pode refazer o formulário a qualquer momento. Além disso, nossa equipe está disponível para esclarecer qualquer ponto do diagnóstico. Lembre-se: o objetivo é ajudar, não julgar. É um ponto de partida para sua transformação.",
    icon: <Users className="w-5 h-5" />,
    category: "community",
  },
  {
    id: "faq-10",
    question: "Quais materiais bônus vou receber ao compartilhar?",
    answer:
      "Ao compartilhar sobre o diagnóstico nas redes sociais, você desbloqueia 4 materiais exclusivos: (1) Planilha de Controle Financeiro Avançada com fórmulas automáticas, (2) E-book '7 Passos para Saúde Financeira' com estratégias práticas, (3) Guia Prático de Investimentos para Iniciantes, e (4) Checklist de Organização Financeira. São materiais premium que normalmente são pagos, mas liberamos gratuitamente para quem compartilha e ajuda outras pessoas a descobrirem a ferramenta.",
    icon: <Sparkles className="w-5 h-5" />,
    category: "results",
  },
];

const categoryColors = {
  privacy: "text-green-400",
  process: "text-blue-400",
  community: "text-purple-400",
  results: "text-pink-400",
};

const categoryBadges = {
  privacy: { label: "Privacidade", color: "bg-green-500/10 text-green-400" },
  process: { label: "Processo", color: "bg-blue-500/10 text-blue-400" },
  community: { label: "Comunidade", color: "bg-purple-500/10 text-purple-400" },
  results: { label: "Resultados", color: "bg-pink-500/10 text-pink-400" },
};

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFAQs = useMemo(() => {
    let faqs = faqData;

    // Filter by category
    if (selectedCategory !== "all") {
      faqs = faqs.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      faqs = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query),
      );
    }

    return faqs;
  }, [selectedCategory, searchQuery]);

  const categories = [
    {
      id: "all",
      label: "Todas",
      icon: <Sparkles className="w-4 h-4" />,
      count: faqData.length,
    },
    {
      id: "privacy",
      label: "Privacidade",
      icon: <Shield className="w-4 h-4" />,
      count: faqData.filter((f) => f.category === "privacy").length,
    },
    {
      id: "process",
      label: "Processo",
      icon: <Clock className="w-4 h-4" />,
      count: faqData.filter((f) => f.category === "process").length,
    },
    {
      id: "community",
      label: "Comunidade",
      icon: <Users className="w-4 h-4" />,
      count: faqData.filter((f) => f.category === "community").length,
    },
    {
      id: "results",
      label: "Resultados",
      icon: <FileCheck className="w-4 h-4" />,
      count: faqData.filter((f) => f.category === "results").length,
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Perguntas Frequentes
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-finansi-primary mb-4">
            Suas Dúvidas,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              Respondidas
            </span>
          </h2>
          <p className="text-finansi-secondary text-lg max-w-2xl mx-auto">
            Tudo que você precisa saber sobre sigilo, privacidade, processo e
            resultados do diagnóstico financeiro.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-6"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar perguntas... (ex: privacidade, dados, tempo)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border border-gray-300 rounded-xl text-finansi-primary placeholder-finansi-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-finansi-tertiary hover:text-finansi-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-3 text-sm text-finansi-secondary"
            >
              {filteredFAQs.length} resultado
              {filteredFAQs.length !== 1 ? "s" : ""} para "{searchQuery}"
            </motion.p>
          )}
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
                  ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-white text-finansi-secondary border border-gray-200 hover:bg-primary-light hover:text-primary"
                  }
                `}
              >
                {category.icon}
                <span>{category.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedCategory === category.id
                      ? "bg-white/20"
                      : "bg-gray-100 text-finansi-tertiary"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion
            type="single"
            collapsible
            className="space-y-4"
            defaultValue="faq-1"
            key={selectedCategory}
          >
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12 text-finansi-secondary">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50 text-finansi-tertiary" />
                <p className="text-lg font-semibold mb-2 text-finansi-primary">
                  Nenhum resultado encontrado
                </p>
                <p className="text-sm">
                  {searchQuery
                    ? `Tente buscar por outros termos ou limpe a busca`
                    : `Nenhuma pergunta encontrada nesta categoria`}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-4 text-primary hover:text-primary-light underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={faq.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary/30 transition-colors px-6 shadow-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline group">
                      <div className="flex items-start gap-4 pr-4">
                        <div
                          className={`flex-shrink-0 mt-1 ${categoryColors[faq.category]}`}
                        >
                          {faq.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${categoryBadges[faq.category].color}`}
                            >
                              {categoryBadges[faq.category].label}
                            </span>
                          </div>
                          <h3 className="text-base md:text-lg font-semibold text-finansi-primary group-hover:text-primary transition-colors">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-finansi-secondary leading-relaxed pl-9">
                      <div className="pt-2">{faq.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))
            )}
          </Accordion>

          {/* Results Counter */}
          {selectedCategory !== "all" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6 text-finansi-secondary text-sm"
            >
              Mostrando {filteredFAQs.length}{" "}
              {filteredFAQs.length === 1 ? "pergunta" : "perguntas"} em{" "}
              <span className="text-primary font-semibold">
                {categories.find((c) => c.id === selectedCategory)?.label}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary-light/10 border border-primary/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-finansi-primary mb-3">
              Ainda tem dúvidas?
            </h3>
            <p className="text-finansi-secondary mb-6 max-w-xl mx-auto">
              Nossa equipe está pronta para ajudar! Entre em contato através do
              WhatsApp ou email e teremos prazer em esclarecer qualquer questão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5591988165507"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-success hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Falar no WhatsApp
              </a>
              <a
                href="mailto:suporte@finanpsi.com"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                <FileCheck className="w-5 h-5" />
                Enviar Email
              </a>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          <div className="flex items-center gap-2 text-finansi-secondary">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm">Dados Protegidos</span>
          </div>
          <div className="flex items-center gap-2 text-finansi-secondary">
            <Lock className="w-5 h-5 text-info" />
            <span className="text-sm">LGPD Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-finansi-secondary">
            <FileCheck className="w-5 h-5 text-primary" />
            <span className="text-sm">100% Gratuito</span>
          </div>
          <div className="flex items-center gap-2 text-finansi-secondary">
            <Sparkles className="w-5 h-5 text-accent-pink" />
            <span className="text-sm">Resultados Instantâneos</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
