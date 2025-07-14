document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[name="cursos"]');
    const submitButton = document.querySelector('button[type="submit"]');
    const form = document.getElementById('inscricaoForm');
    let lastChecked = null;

    // Cria o elemento de mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mt-4';
    errorDiv.style.display = 'none';
    errorDiv.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-400 text-xl"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm text-red-700">
                    É necessário selecionar pelo menos um curso.
                </p>
            </div>
        </div>
    `;

    // Insere a mensagem de erro após a seção de cursos
    const cursosSection = document.querySelector('.space-y-6');
    cursosSection.appendChild(errorDiv);

    // Função para verificar se um curso é integral
    function isIntegral(checkbox) {
        const periodoText = checkbox.closest('.bg-gray-50').querySelector('.text-gray-600').textContent;
        return periodoText.includes('Integral');
    }

    // Função para verificar se há pelo menos um curso selecionado
    function hasSelectedCourse() {
        return Array.from(checkboxes).some(checkbox => checkbox.checked);
    }

    // Função para verificar se há algum curso integral selecionado
    function hasIntegralSelected() {
        return Array.from(checkboxes).some(checkbox => checkbox.checked && isIntegral(checkbox));
    }

    // Função para atualizar estado dos checkboxes
    function updateCheckboxStates(currentCheckbox) {
        const isCurrentIntegral = isIntegral(currentCheckbox);
        const isCurrentChecked = currentCheckbox.checked;

        // Se desmarcou, verifica se ainda há cursos integrais selecionados
        if (!isCurrentChecked) {
            if (hasIntegralSelected()) {
                // Se ainda há curso integral selecionado, mantém subsequentes desabilitados
                checkboxes.forEach(cb => {
                    if (!isIntegral(cb)) {
                        cb.disabled = true;
                        cb.checked = false;
                        cb.parentElement.parentElement.classList.add('opacity-50');
                    } else {
                        cb.disabled = false;
                        cb.parentElement.parentElement.classList.remove('opacity-50');
                    }
                });
            } else {
                // Se não há mais integrais selecionados, habilita todos
                resetCheckboxStates();
            }

            const btnDisabled = !hasSelectedCourse();
            submitButton.disabled = btnDisabled;
            if (btnDisabled) {
                submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            return;
        }

        // Se marcou um curso integral, permite marcar apenas outros integrais
        if (isCurrentIntegral) {
            checkboxes.forEach(cb => {
                if (cb !== currentCheckbox) {
                    if (!isIntegral(cb)) {
                        cb.disabled = true;
                        cb.checked = false;
                        cb.parentElement.parentElement.classList.add('opacity-50');
                    } else {
                        cb.disabled = false;
                        cb.parentElement.parentElement.classList.remove('opacity-50');
                    }
                }
            });
        } 
        // Se marcou um curso não integral (subsequente), desabilita todos os outros
        else {
            checkboxes.forEach(cb => {
                if (cb !== currentCheckbox) {
                    cb.disabled = true;
                    cb.checked = false;
                    cb.parentElement.parentElement.classList.add('opacity-50');
                }
            });
        }

        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        errorDiv.style.display = 'none';
    }

    // Função para resetar estados dos checkboxes
    function resetCheckboxStates() {
        checkboxes.forEach(cb => {
            cb.disabled = false;
            cb.parentElement.parentElement.classList.remove('opacity-50');
        });
    }

    // Verifica checkboxes já marcados ao carregar a página
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            updateCheckboxStates(checkbox);
            lastChecked = checkbox;
        }
    });

    // Adiciona listeners para cada checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!this.checked) {
                if (lastChecked === this) {
                    lastChecked = null;
                }
            } else {
                lastChecked = this;
            }
            updateCheckboxStates(this);
            // Esconde a mensagem de erro quando um curso é selecionado
            if (hasSelectedCourse()) {
                errorDiv.style.display = 'none';
            }
        });
    });

    // Adiciona validação ao formulário
    form.addEventListener('submit', function(e) {
        if (!hasSelectedCourse()) {
            e.preventDefault();
            errorDiv.style.display = 'block';
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Inicializa o estado do botão submit baseado nos checkboxes já marcados
    if (hasSelectedCourse()) {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    }
});
