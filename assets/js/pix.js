/* =========================================================================
   Gerador de Pix Copia e Cola (BR Code / EMV-MPM) — padrão Banco Central
   Monta o payload com o valor já embutido, para o pagador não digitar nada.
   ========================================================================= */

(function (global) {
  'use strict';

  /* Campo EMV: id + tamanho (2 dígitos) + valor */
  function campo(id, valor) {
    var v = String(valor);
    return id + String(v.length).padStart(2, '0') + v;
  }

  /* Remove acentos, caracteres fora do ASCII imprimível e força maiúsculas */
  function normalizar(texto, limite) {
    var t = String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x20-\x7E]/g, '')
      .toUpperCase()
      .trim();
    return limite ? t.slice(0, limite) : t;
  }

  /* CRC16-CCITT (polinômio 0x1021, inicial 0xFFFF) exigido pelo BR Code */
  function crc16(payload) {
    var crc = 0xffff;
    for (var i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (var bit = 0; bit < 8; bit++) {
        crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  /**
   * Monta o código Pix Copia e Cola.
   * @param {{chave:string, nome:string, cidade:string, valor?:number, txid?:string}} dados
   * @returns {string} payload pronto para colar no app do banco
   */
  function gerarPix(dados) {
    var chave = String(dados.chave || '').trim();
    if (!chave) return '';

    var merchantAccount = campo('00', 'BR.GOV.BCB.PIX') + campo('01', chave);

    var payload =
      campo('00', '01') +                       // payload format indicator
      campo('26', merchantAccount) +            // conta do recebedor (Pix)
      campo('52', '0000') +                     // merchant category code
      campo('53', '986');                       // moeda: BRL

    if (dados.valor && Number(dados.valor) > 0) {
      payload += campo('54', Number(dados.valor).toFixed(2));
    }

    payload +=
      campo('58', 'BR') +
      campo('59', normalizar(dados.nome, 25) || 'RECEBEDOR') +
      campo('60', normalizar(dados.cidade, 15) || 'BRASIL') +
      campo('62', campo('05', normalizar(dados.txid, 25) || '***'));

    payload += '6304';
    return payload + crc16(payload);
  }

  global.gerarPix = gerarPix;
})(window);
