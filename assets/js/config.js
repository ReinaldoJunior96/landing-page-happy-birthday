/* =========================================================================
   CENTRAL DE PRESENTES DA LANA — configuração
   Este é o único arquivo que você precisa editar para o site ficar no ar.
   ========================================================================= */

window.LANA_CONFIG = {
  // ---- Dados da aniversariante ------------------------------------------
  nome: 'Lanna',

  // ---- PIX ---------------------------------------------------------------
  // Cole aqui a chave Pix da Lana (CPF, e-mail, telefone com +55 ou aleatória).
  // Enquanto estiver vazio, o site mostra um aviso honesto de "chave pendente"
  // em vez de um QR Code falso.
  pixChave: '61758435330',

  // Nome do titular como está cadastrado no banco (máx. 25 caracteres,
  // sem acentos — o site remove os acentos sozinho).
  pixNome: 'LANNA LAYZA LIMA ROCHA',

  // Cidade do titular (máx. 15 caracteres).
  pixCidade: 'SAO LUIS',

  // ---- WhatsApp ----------------------------------------------------------
  // Número no formato internacional, só dígitos. Ex.: '5511999999999'
  // Usado no botão "avisar a Lana" depois do Pix. Deixe vazio para esconder.
  whatsapp: '',

  // ---- QR fornecido pelo banco -------------------------------------------
  // Sem valor: usa o QR original e seu copia e cola exato, conferido por leitura.
  // Com valor escolhido: gera um novo QR local para incluir o valor no código.
  qrCodeImagem: 'assets/img/qr.png',
  pixCodigoOriginal: '00020101021126330014br.gov.bcb.pix0111617584353305204000053039865802BR5915LANNA L L ROCHA6008SAO LUIS62070503***63041F7D',
};
