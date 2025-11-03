/**
 * Funções de validação reutilizáveis
 */

/**
 * Valida formato de email usando regex robusto
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  // Regex melhorado para validação de email
  // Suporta caracteres especiais, subdomínios, etc.
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email.trim());
}

/**
 * Valida se o domínio do email é válido (opcional, mais rigoroso)
 */
export function isValidEmailDomain(email: string): boolean {
  if (!isValidEmail(email)) {
    return false;
  }

  const domain = email.split("@")[1]?.toLowerCase();

  if (!domain) {
    return false;
  }

  // Lista de domínios inválidos comuns (spam)
  const invalidDomains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "throwaway.email",
    "fakeinbox.com",
  ];

  if (invalidDomains.includes(domain)) {
    return false;
  }

  // Verificar se o domínio tem pelo menos um ponto (ex: gmail.com)
  if (!domain.includes(".")) {
    return false;
  }

  // Verificar se termina com TLD válido (pelo menos 2 caracteres)
  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) {
    return false;
  }

  return true;
}

/**
 * Valida formato de telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") {
    return false;
  }

  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Telefone brasileiro: 10 ou 11 dígitos (com ou sem DDD)
  // Formato: (XX) XXXXX-XXXX ou (XX) XXXXXXXXX
  return cleaned.length >= 10 && cleaned.length <= 11;
}

/**
 * Formata telefone brasileiro
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return phone; // Retorna original se não conseguir formatar
}

/**
 * Valida nome (mínimo 2 caracteres, apenas letras e espaços)
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== "string") {
    return false;
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return false;
  }

  // Aceita letras, espaços, acentos e caracteres especiais comuns em nomes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;

  return nameRegex.test(trimmed);
}

/**
 * Valida se o campo não está vazio
 */
export function isNotEmpty(value: string): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Retorna mensagem de erro de validação
 */
export function getValidationError(field: string, value: string): string | null {
  switch (field) {
    case "email":
      if (!isNotEmpty(value)) {
        return "Email é obrigatório";
      }
      if (!isValidEmail(value)) {
        return "Email inválido. Verifique o formato.";
      }
      if (!isValidEmailDomain(value)) {
        return "Domínio de email inválido ou não permitido.";
      }
      return null;

    case "name":
      if (!isNotEmpty(value)) {
        return "Nome é obrigatório";
      }
      if (!isValidName(value)) {
        return "Nome deve ter pelo menos 2 caracteres e conter apenas letras.";
      }
      return null;

    case "phone":
      if (value && !isValidPhone(value)) {
        return "Telefone inválido. Use o formato (XX) XXXXX-XXXX";
      }
      return null;

    default:
      return null;
  }
}

