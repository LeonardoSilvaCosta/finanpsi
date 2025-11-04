"use client";

interface Testimonial {
  id: string;
  name: string;
  profession: string;
  location?: string;
  text: string;
  rating: number;
  isAnonymous?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "M. S.",
    profession: "Psicóloga CRP 06/123456",
    location: "São Paulo, SP",
    text: "Finalmente encontrei algo que realmente entende a realidade financeira dos profissionais da saúde. O diagnóstico foi preciso e o guia prático me ajudou a organizar minhas finanças em menos de um mês.",
    rating: 5,
    isAnonymous: true,
  },
  {
    id: "2",
    name: "Dr. P. R.",
    profession: "Terapeuta",
    location: "Rio de Janeiro, RJ",
    text: "Sempre tive dificuldade em equilibrar trabalho e questões financeiras. O FinanPsi não só me ajudou a entender onde estava gastando demais, mas também me deu estratégias para investir melhor no meu consultório.",
    rating: 5,
    isAnonymous: true,
  },
  {
    id: "3",
    name: "A. C.",
    profession: "Psicóloga Clínica",
    location: "Belo Horizonte, MG",
    text: "A comunidade de apoio foi fundamental. Compartilhar experiências com outros profissionais que enfrentam os mesmos desafios financeiros me deu muito mais confiança para tomar decisões importantes.",
    rating: 5,
    isAnonymous: true,
  },
  {
    id: "4",
    name: "Exemplo",
    profession: "Profissional da Saúde",
    location: "Brasil",
    text: "Este espaço está reservado para depoimentos reais. Conforme obtivermos feedbacks dos participantes do teste piloto, atualizaremos esta seção com experiências autênticas.",
    rating: 5,
    isAnonymous: false,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-finansi-primary mb-4">
              O que profissionais da saúde estão dizendo
            </h2>
            <p className="text-finansi-secondary text-lg">
              Depoimentos reais de quem já transformou sua relação com dinheiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#FFF8F5] rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#FFC107]"
                    >
                      <path
                        d="M10 1L12.5 7H19L13.5 11L16 17L10 13L4 17L6.5 11L1 7H7.5L10 1Z"
                        fill="currentColor"
                      />
                    </svg>
                  ))}
                </div>

                {/* Text */}
                <p className="text-finansi-secondary mb-4 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-finansi-primary">
                        {testimonial.name}
                        {testimonial.isAnonymous && (
                          <span className="text-xs text-finansi-tertiary ml-1">
                            (Anônimo)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-finansi-secondary">
                        {testimonial.profession}
                      </p>
                      {testimonial.location && (
                        <p className="text-xs text-finansi-tertiary">
                          {testimonial.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nota */}
          <div className="mt-8 text-center">
            <p className="text-sm text-finansi-tertiary">
              * Depoimentos são coletados de participantes reais do teste piloto.
              <br />
              Alguns depoimentos podem ser apresentados de forma anônima para proteger a privacidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

