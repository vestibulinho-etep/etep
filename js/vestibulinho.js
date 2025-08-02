// Configurações do Vestibulinho (carregadas dinamicamente)
let vestibulinhoAtivo = false;

// Função para controlar o modal do vestibulinho
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os elementos com name="vestibulinho-link"
    const vestibulinhoLinks = document.querySelectorAll('[name="vestibulinho-link"]');
    const modal = document.getElementById('modal-vestibulinho');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');

    // Adiciona event listener para cada link do vestibulinho
    vestibulinhoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Se vestibulinho não estiver ativo, abre o modal
            if (!vestibulinhoAtivo) {
                e.preventDefault(); // Impede navegação para vestibulinho.html
                abrirModal();
            }
            // Se estiver ativo, permite navegação normal para vestibulinho.html
        });
    });

    // Event listeners para fechar o modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', fecharModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', fecharModal);
    }

    // Event listener para fechar ao clicar fora do modal-content
    if (modal) {
        modal.addEventListener('click', function(e) {
            // Se o clique foi diretamente no modal (fora do modal-content), fecha o modal
            if (e.target === modal || e.target.closest('#modal-content') === null) {
                fecharModal();
            }
        });
    }

    // Prevenir que cliques dentro do modal-content fechem o modal
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            fecharModal();
        }
    });

    // Função para abrir o modal
    function abrirModal() {
        if (modal && modalOverlay && modalContent) {
            modal.classList.remove('hidden');
            
            // Animação de entrada
            setTimeout(() => {
                modalOverlay.classList.remove('opacity-0');
                modalOverlay.classList.add('opacity-50');
                modalContent.classList.remove('opacity-0', 'translate-y-4');
                modalContent.classList.add('opacity-100', 'translate-y-0');
            }, 10);
        }
    }

    // Função para fechar o modal
    function fecharModal() {
        if (modal && modalOverlay && modalContent) {
            // Animação de saída
            modalOverlay.classList.remove('opacity-50');
            modalOverlay.classList.add('opacity-0');
            modalContent.classList.remove('opacity-100', 'translate-y-0');
            modalContent.classList.add('opacity-0', 'translate-y-4');
            
            // Esconde o modal após a animação
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    }
});
