// Funcionalidades gerais do sistema de vestibulinho
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para telefone (usado em outros formulários)
    const phoneInput = document.querySelector('input[name="telefone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length > 2) value = '(' + value.substring(0,2) + ') ' + value.substring(2);
                if (value.length > 9) value = value.substring(0,9) + '-' + value.substring(9);
                e.target.value = value;
            }
        });
    }
});

// Validação genérica de CPF removida - agora está em validarCpf.js

// Validação genérica de formulário
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// Animações de entrada
function animateElements() {
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Inicialização de animações
document.addEventListener('DOMContentLoaded', animateElements);

// Função para aplicar máscara genérica de CPF removida - agora está em validarCpf.js

// Função para aplicar máscara de CEP
function aplicarMascaraCEP(input) {
    if (!input) return;
    
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 8) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        }
    });
    
    input.setAttribute('maxlength', '9');
}

// Função para aplicar máscara de telefone
function aplicarMascaraTelefone(input) {
    if (!input) return;
    
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length > 2) value = '(' + value.substring(0,2) + ') ' + value.substring(2);
            if (value.length > 9) value = value.substring(0,9) + '-' + value.substring(9);
            e.target.value = value;
        }
    });
}

// Função para alternar campos baseado no valor de um select
function alternarCamposPorSelect(selectId, camposConfig) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    
    function toggleCampos() {
        const valorSelecionado = selectElement.value;
        
        // Esconde todos os campos primeiro
        Object.values(camposConfig).forEach(config => {
            if (config.elemento) {
                config.elemento.style.display = 'none';
            }
        });
        
        // Mostra apenas o campo correspondente ao valor selecionado
        if (camposConfig[valorSelecionado]) {
            const config = camposConfig[valorSelecionado];
            if (config.elemento) {
                config.elemento.style.display = 'block';
            }
            
            // Limpa campos dos outros tipos
            Object.keys(camposConfig).forEach(key => {
                if (key !== valorSelecionado && camposConfig[key].camposParaLimpar) {
                    camposConfig[key].camposParaLimpar.forEach(campo => {
                        if (campo) campo.value = '';
                    });
                }
            });
        }
    }
    
    // Inicializar campos
    toggleCampos();
    
    // Atualizar quando o valor mudar
    selectElement.addEventListener('change', toggleCampos);
}

// Função para validar inputs numéricos com limites
function validarInputsNumericos(selector = 'input[type="number"]') {
    const inputs = document.querySelectorAll(selector);
    
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const valor = parseFloat(e.target.value);
            const max = parseFloat(e.target.max);
            const min = parseFloat(e.target.min) || 0;
            
            if (valor > max) {
                e.target.value = max;
            } else if (valor < min) {
                e.target.value = min;
            }
        });
    });
} 