const vestibulinhoAtivo = false;

// Função para mostrar o modal com animação
function showModal() {
    const modal = document.getElementById('modal-vestibulinho');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    // Remove a classe hidden do modal
    modal.classList.remove('hidden');
    
    // Pequeno timeout para garantir que a transição funcione
    requestAnimationFrame(() => {
        // Anima o overlay
        overlay.classList.add('bg-opacity-50');
        overlay.classList.add('opacity-100');
        
        // Anima o conteúdo
        content.classList.add('modal-animate-in');
        content.classList.remove('translate-y-4');
        content.classList.add('opacity-100');
    });
    
    // Previne rolagem do body
    document.body.style.overflow = 'hidden';
}

// Função para esconder o modal com animação
function hideModal() {
    const modal = document.getElementById('modal-vestibulinho');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    // Inicia a animação de saída
    overlay.classList.remove('bg-opacity-50', 'opacity-100');
    content.classList.remove('modal-animate-in', 'opacity-100');
    content.classList.add('modal-animate-out', 'translate-y-4');
    
    // Aguarda a animação terminar antes de esconder o modal
    setTimeout(() => {
        modal.classList.add('hidden');
        content.classList.remove('modal-animate-out');
        document.body.style.overflow = ''; // Restaura rolagem do body
    }, 300); // Tempo igual à duração da animação
}

// Função para controlar o comportamento dos links do vestibulinho
function handleVestibulinhoLinks() {
    // Seleciona todos os links que apontam para vestibulinho.html
    const vestibulinhoLinks = document.querySelectorAll('a[href="vestibulinho.html"]');

    vestibulinhoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!vestibulinhoAtivo) {
                e.preventDefault(); // Previne a navegação para vestibulinho.html
                showModal();
            }
            // Se vestibulinhoAtivo for true, o link funcionará normalmente
        });
    });

    // Adiciona evento de clique no botão de fechar e no overlay
    const closeButton = document.getElementById('close-modal');
    const modal = document.getElementById('modal-vestibulinho');

    if (closeButton) {
        closeButton.addEventListener('click', hideModal);
    }

    // Fecha o modal ao clicar no overlay (área escura)
    modal.addEventListener('click', (e) => {
        // Se o clique foi fora do modal-content
        if (!e.target.closest('#modal-content') && !e.target.closest('.modal-close-button')) {
            hideModal();
        }
    });

    // Adiciona suporte para fechar com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });
}

// Inicializa o controle dos links quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', handleVestibulinhoLinks);