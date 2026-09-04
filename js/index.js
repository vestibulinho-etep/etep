/**
 * index.js - Lógica da página inicial vinculada ao Vestibulinho
 * Integração com js/vestibulinho.js
 */

// Caso js/vestibulinho.js não tenha sido carregado anteriormente, assegura o carregamento
if (typeof inicializarVestibulinho !== 'function') {
    const script = document.createElement('script');
    script.src = 'js/vestibulinho.js';
    document.head.appendChild(script);
}