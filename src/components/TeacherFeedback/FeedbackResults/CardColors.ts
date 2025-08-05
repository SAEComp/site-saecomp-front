// src/utils/instituteTheme.ts

// As constantes de cores são mantidas aqui, internas a este módulo.
export const instituteColors = {
  EESC: "bg-yellow-500",
  ICMC: "bg-blue-800",
  IAU: "bg-red-700",
  IFSC: "bg-blue-400",
  IQSC: "bg-green-500",
  DEFAULT: "bg-gray-600", // Alterado de black-400 para gray-600 para melhor visualização
};

export const auxInstituteColors = {
  EESC: "bg-yellow-400",
  ICMC: "bg-blue-400",
  IAU: "bg-red-500",
  IFSC: "bg-blue-200",
  IQSC: "bg-green-300",
  DEFAULT: "bg-gray-400",
};

// 1. Exportamos o tipo para que os componentes saibam quais códigos de instituto são válidos.
// Isso é útil para tipar props, por exemplo.
export type InstituteCode = keyof typeof instituteColors;

// 2. A função de verificação (type guard) é mantida interna ao módulo.
// Não precisamos exportá-la, pois a função principal abaixo já a utilizará.
function isInstituteCode(key: any): key is InstituteCode {
  // Verifica se a chave fornecida existe no nosso objeto de cores.
  return key in instituteColors;
}

// 3. Criamos e exportamos uma função "getter" que encapsula toda a lógica.
// Esta é a principal função que seus componentes irão importar e usar.
export function getInstituteTheme(code: string | null | undefined) {
  // Verifica se o código é válido usando nossa função de verificação.
  if (code && isInstituteCode(code)) {
    // Se for válido, o TypeScript sabe que 'code' é uma chave segura para usar.
    return {
      bgColor: instituteColors[code],
      auxColor: auxInstituteColors[code],
    };
  }

  // Se o código for nulo, indefinido ou inválido, retorna o tema padrão.
  return {
    bgColor: instituteColors.DEFAULT,
    auxColor: auxInstituteColors.DEFAULT,
  };
}