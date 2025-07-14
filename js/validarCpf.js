// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto > 9 ? 0 : resto;
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto > 9 ? 0 : resto;
    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}

// Função de compatibilidade para o nome usado em outros scripts
function validateCPF(cpf) {
    return validarCPF(cpf);
}

// Função para aplicar máscara genérica de CPF
function aplicarMascaraCPFGenerico(input) {
    if (!input) return;
    
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        }
    });
    
    input.setAttribute('maxlength', '14');
}

// Função para aplicar máscara de CPF com validação em tempo real
function aplicarMascaraCPFCompleta(input, isRequired = true) {
    if (!input) return;
    
    // Aplica a máscara
    aplicarMascaraCPFGenerico(input);
    
    // Aplica a validação em tempo real
    aplicarValidacaoCPFTempoReal(input, isRequired);
}

// Função para mostrar mensagem de sucesso
function mostrarMensagemSucesso(inputElement, mensagem) {
    // Remove apenas mensagens de erro (mantém sucesso existente)
    removerApenasErro(inputElement);

    // Verifica se já existe uma mensagem de sucesso
    const existingSuccessDiv = inputElement.parentNode.querySelector('.mensagem-sucesso-cpf');
    if (existingSuccessDiv) {
        return; // Não cria outra mensagem de sucesso
    }

    // Cria o elemento de mensagem de sucesso
    const successDiv = document.createElement('div');
    successDiv.className = 'bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mt-2 mensagem-sucesso-cpf';
    
    successDiv.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="fas fa-check-circle text-green-400"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm text-green-700">
                    ${mensagem}
                </p>
            </div>
        </div>
    `;

    // Insere a mensagem após o input
    inputElement.parentNode.insertBefore(successDiv, inputElement.nextSibling);
}

// Função para mostrar mensagem de erro no estilo do Django
function mostrarMensagemErro(inputElement, mensagem) {
    // Remove mensagem de erro anterior se existir
    removerMensagemErro(inputElement);

    // Cria o elemento de mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mt-2 mensagem-erro-cpf';
    
    errorDiv.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm text-red-700">
                    ${mensagem}
                </p>
            </div>
        </div>
    `;

    // Insere a mensagem após o input
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

// Função para remover mensagem de erro
function removerMensagemErro(inputElement) {
    // Remove mensagens de erro do JavaScript
    const errorDiv = inputElement.parentNode.querySelector('.mensagem-erro-cpf');
    if (errorDiv) {
        errorDiv.remove();
    }

    // Remove mensagens de sucesso do JavaScript
    const successDiv = inputElement.parentNode.querySelector('.mensagem-sucesso-cpf');
    if (successDiv) {
        successDiv.remove();
    }

    // Remove mensagens de erro do Django
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
        // Remove mensagens de erro específicas do campo
        const djangoErrors = formGroup.querySelectorAll('.text-red-600, .text-sm.text-red-700');
        djangoErrors.forEach(error => error.remove());
    }
}

// Função para remover apenas mensagens de erro (mantém sucesso)
function removerApenasErro(inputElement) {
    // Remove mensagens de erro do JavaScript
    const errorDiv = inputElement.parentNode.querySelector('.mensagem-erro-cpf');
    if (errorDiv) {
        errorDiv.remove();
    }

    // Remove mensagens de erro do Django
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
        // Remove mensagens de erro específicas do campo
        const djangoErrors = formGroup.querySelectorAll('.text-red-600, .text-sm.text-red-700');
        djangoErrors.forEach(error => error.remove());
    }
}

// Função para validar campo de CPF
function validarCampoCPF(inputElement, isRequired = true) {
    const cpf = inputElement.value.replace(/[^\d]/g, '');
    
    // Se o campo não é obrigatório e está vazio, não mostra erro
    if (!isRequired && !cpf) {
        removerMensagemErro(inputElement);
        return true;
    }

    // Se o CPF é inválido e não está vazio, mostra erro
    if (!validarCPF(cpf) && cpf) {
        mostrarMensagemErro(inputElement, 'CPF inválido. Por favor, verifique o número informado.');
        return false;
    }

    // Se o CPF é válido, remove apenas mensagens de erro (mantém sucesso)
    if (validarCPF(cpf) && cpf.length === 11) {
        removerApenasErro(inputElement);
        
        // Se não há mensagem de sucesso, mostra uma
        const successDiv = inputElement.parentNode.querySelector('.mensagem-sucesso-cpf');
        if (!successDiv) {
            mostrarMensagemSucesso(inputElement, 'CPF válido!');
        }
        return true;
    }

    // Se o CPF está incompleto, remove mensagens
    removerMensagemErro(inputElement);
    return true;
}

// Função para validar CPF em tempo real durante a digitação
function validarCPFTempoReal(inputElement, isRequired = true) {
    const cpf = inputElement.value.replace(/[^\d]/g, '');
    
    // Se o campo não é obrigatório e está vazio, não mostra nada
    if (!isRequired && !cpf) {
        removerMensagemErro(inputElement);
        return;
    }

    // Se ainda não tem 11 dígitos, remove mensagens existentes
    if (cpf.length < 11) {
        removerMensagemErro(inputElement);
        return;
    }

    // Se tem 11 dígitos, valida
    if (cpf.length === 11) {
        if (validarCPF(cpf)) {
            mostrarMensagemSucesso(inputElement, 'CPF válido!');
        } else {
            mostrarMensagemErro(inputElement, 'CPF inválido. Por favor, verifique o número informado.');
        }
    }
}

// Função para aplicar validação em tempo real a um campo de CPF
function aplicarValidacaoCPFTempoReal(inputElement, isRequired = true) {
    if (!inputElement) return;
    
    inputElement.addEventListener('input', function() {
        validarCPFTempoReal(this, isRequired);
    });
    
    // Mantém a validação no blur para casos onde o usuário sai do campo
    inputElement.addEventListener('blur', function() {
        validarCampoCPF(this, isRequired);
    });
}

// Função para aplicar validação automática a todos os campos de CPF na página
function aplicarValidacaoCPFAutomatica() {
    // Busca por campos com id ou name que contenham 'cpf'
    const camposCPF = document.querySelectorAll('input[name*="cpf"], input[id*="cpf"], input[name*="CPF"], input[id*="CPF"]');
    
    camposCPF.forEach(campo => {
        // Evita aplicar validação duplicada
        if (campo.dataset.cpfValidacaoAplicada) {
            return;
        }
        
        // Marca o campo como já processado
        campo.dataset.cpfValidacaoAplicada = 'true';
        
        // Determina se o campo é obrigatório
        const isRequired = campo.hasAttribute('required') || campo.closest('.form-group')?.querySelector('label')?.textContent.includes('*');
        
        // Aplica máscara e validação completa
        aplicarMascaraCPFCompleta(campo, isRequired);
    });
}

// Inicializa automaticamente quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda um pouco para garantir que outros scripts tenham terminado
    setTimeout(function() {
        aplicarValidacaoCPFAutomatica();
    }, 100);
}); 