"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-text py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo e Descrição */}
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-primary-dark">FinanPsi</span>
              </h3>
              <p className="text-footer-text text-sm leading-relaxed">
                Transformando a relação entre saúde financeira e bem-estar
                emocional de profissionais da saúde.
              </p>
            </div>

            {/* Links Rápidos */}
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#beneficios"
                    className="text-footer-text hover:text-primary-light transition-colors text-sm"
                  >
                    Benefícios
                  </Link>
                </li>
                <li>
                  <Link
                    href="#inscrever"
                    className="text-footer-text hover:text-primary-light transition-colors text-sm"
                  >
                    Inscrição
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-footer-text hover:text-primary-light transition-colors text-sm"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:contato@finanpsi.com.br"
                    className="text-footer-text hover:text-primary-light transition-colors text-sm"
                  >
                    contato@finanpsi.com.br
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-footer-text hover:text-primary-light transition-colors text-sm"
                  >
                    Grupo no WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-footer-border pt-8 text-center">
            <p className="text-footer-text text-sm">
              © {new Date().getFullYear()} FinanPsi. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
