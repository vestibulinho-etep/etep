// Funcionalidades específicas do formulário de inscrição
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando formulário de inscrição...');
    
    // Elementos do formulário
    const cpfInput = document.querySelector('input[name="cpf"]');
    const cpfResponsavelInput = document.querySelector('input[name="cpf_responsavel"]');
    const dataNascimentoInput = document.querySelector('input[name="data_nascimento"]');
    const pcdCheckbox = document.querySelector('input[name="pcd"]');
    const acessibilidadeCheckbox = document.querySelector('input[name="acessibilidade_solicitada"]');
    
    // Campos condicionais
    const responsavelFields = document.querySelector('.responsavel-field');
    const pcdDescricaoField = document.querySelector('.pcd-descricao-field');
    const acessibilidadeDescricaoField = document.querySelector('.acessibilidade-descricao-field');

    // Função para verificar se o responsável é obrigatório baseado na idade
    function verificarIdadeResponsavel() {
        if (!dataNascimentoInput || !dataNascimentoInput.value) return false;
        
        const dataNascimento = new Date(dataNascimentoInput.value);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const mes = hoje.getMonth() - dataNascimento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
            idade--;
        }
        
        return idade < 18;
    }

    // Função para controlar campos de responsável baseado na idade
    function toggleResponsavelFields() {
        const nomeResponsavel = document.querySelector('input[name="nome_responsavel"]');
        const cpfResponsavel = document.querySelector('input[name="cpf_responsavel"]');
        
        if (responsavelFields && dataNascimentoInput && dataNascimentoInput.value) {
            const isRequired = verificarIdadeResponsavel();
            
            if (isRequired) {
                responsavelFields.style.display = 'block';
                if (nomeResponsavel) {
                    nomeResponsavel.setAttribute('required', '');
                    nomeResponsavel.classList.add('required-field');
                }
                if (cpfResponsavel) {
                    cpfResponsavel.setAttribute('required', '');
                    cpfResponsavel.classList.add('required-field');
                }
            } else {
                responsavelFields.style.display = 'none';
                if (nomeResponsavel) {
                    nomeResponsavel.removeAttribute('required');
                    nomeResponsavel.classList.remove('required-field');
                    nomeResponsavel.value = '';
                }
                if (cpfResponsavel) {
                    cpfResponsavel.removeAttribute('required');
                    cpfResponsavel.classList.remove('required-field');
                    cpfResponsavel.value = '';
                }
            }
        }
    }

    // Função para controlar o campo de descrição PCD
    function togglePcdDescricao() {
        if (pcdDescricaoField && pcdCheckbox) {
            pcdDescricaoField.style.display = pcdCheckbox.checked ? 'block' : 'none';
            const descricaoTextarea = pcdDescricaoField.querySelector('textarea');
            if (descricaoTextarea) {
                if (pcdCheckbox.checked) {
                    descricaoTextarea.setAttribute('required', '');
                } else {
                    descricaoTextarea.removeAttribute('required');
                    descricaoTextarea.value = '';
                }
            }
        }
    }



    // Função para controlar o campo de descrição Acessibilidade
    function toggleAcessibilidadeDescricao() {
        if (acessibilidadeDescricaoField && acessibilidadeCheckbox) {
            acessibilidadeDescricaoField.style.display = acessibilidadeCheckbox.checked ? 'block' : 'none';
            const descricaoTextarea = acessibilidadeDescricaoField.querySelector('textarea');
            if (descricaoTextarea) {
                if (acessibilidadeCheckbox.checked) {
                    descricaoTextarea.setAttribute('required', '');
                } else {
                    descricaoTextarea.removeAttribute('required');
                    descricaoTextarea.value = '';
                }
            }
        }
    }

    // Função para aplicar máscara no CPF
    function aplicarMascaraCPF(input) {
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

        // Adiciona validação no evento blur
        input.addEventListener('blur', function() {
            const isRequired = input.name === 'cpf_responsavel' ? verificarIdadeResponsavel() : true;
            if (typeof validarCampoCPF === 'function') {
                validarCampoCPF(input, isRequired);
            }
        });
    }

    // Inicialização dos event listeners
    if (dataNascimentoInput) {
        dataNascimentoInput.addEventListener('change', function() {
            toggleResponsavelFields();
            if (cpfResponsavelInput && typeof validarCampoCPF === 'function') {
                const isRequired = verificarIdadeResponsavel();
                validarCampoCPF(cpfResponsavelInput, isRequired);
            }
        });
        
        // Executa na carga inicial para casos de edição
        if (dataNascimentoInput.value) {
            toggleResponsavelFields();
        }
    }

    if (pcdCheckbox) {
        pcdCheckbox.addEventListener('change', togglePcdDescricao);
        // Executa na carga inicial para casos de edição
        togglePcdDescricao();
    }



    if (acessibilidadeCheckbox) {
        acessibilidadeCheckbox.addEventListener('change', toggleAcessibilidadeDescricao);
        // Executa na carga inicial para casos de edição
        toggleAcessibilidadeDescricao();
    }

    // Aplica máscaras nos campos CPF
    aplicarMascaraCPF(cpfInput);
    aplicarMascaraCPF(cpfResponsavelInput);

    // Expõe função para validação do formulário
    window.validateInscricaoForm = function(formId) {
        const form = document.getElementById(formId);
        if (!form) return true;

        let isValid = true;

        // Valida CPF do candidato
        if (cpfInput && typeof validarCampoCPF === 'function') {
            if (!validarCampoCPF(cpfInput)) {
                isValid = false;
            }
        }

        // Valida CPF do responsável se necessário
        if (cpfResponsavelInput && typeof validarCampoCPF === 'function') {
            const isRequired = verificarIdadeResponsavel();
            if (!validarCampoCPF(cpfResponsavelInput, isRequired)) {
                isValid = false;
            }
        }

        return isValid;
    };

    console.log('Formulário de inscrição inicializado com sucesso!');
}); 