var clienteLogadoId = document.getElementById("nome").innerText; // Substitua com a forma real de identificar o cliente logado
console.log(clienteLogadoId);

document.getElementById('ver_saldo').addEventListener('click', () => {
    // Seleciona o ícone dentro do botão
    const saldoElement = document.querySelector('.saldo');
    const icon = document.querySelector('#ver_saldo');
   // Verifica se o saldo está visível
   if (saldoElement.style.display === "block") {
       saldoElement.style.display = "none"; // Esconde o saldo
       icon.innerHTML = '<i class="bi bi-eye-slash-fill"></i>' // Adiciona o ícone de olho fechado
   } else {
       saldoElement.style.display = "block"; // Mostra o saldo
       
       icon.innerHTML = '<i class="bi bi-eye-fill"></i>'// Adiciona o ícone de olho aberto
   }
})

document.getElementById('depositar').addEventListener('click', function() {
    realizarTransacao('Depósito', document.getElementById('valor_deposito').value);
});

document.getElementById('sacar').addEventListener('click', function() {
    realizarTransacao('Saque', document.getElementById('valor_saque').value);
  

});

document.getElementById('limpar_historico').addEventListener('click', function() {
    limparHistorico();
});

document.getElementById('mostrarEntradas').addEventListener('click', function() {
    carregarHistorico('Depósito');
});

document.getElementById('mostrarSaidas').addEventListener('click', function() {
    carregarHistorico('Saque');
});

document.getElementById('mostrarTudo').addEventListener('click',function(){
    carregarHistorico()
})

    
function realizarTransacao(tipo, valor) {
    if (valor && valor > 0) {
        var valorFormatado = parseFloat(valor).toFixed(2);
        var mensagem = tipo + " de R$ " + valorFormatado + " realizado com sucesso!";
        var saldoAtual = parseFloat(document.getElementById('saldo').innerText.replace('R$ ', ''));
       
        if (tipo === 'Saque' && valor > saldoAtual) {
            mensagem = "Saldo insuficiente para realizar o saque.";
            document.getElementById('mensagem').innerText = mensagem;
            return;
          }
          
        // Adiciona ao histórico visual
        var historico = document.getElementById('historico');
        var novaTransacao = document.createElement('li');
        var dataHora = new Date().toLocaleString();
        novaTransacao.textContent = tipo + " de R$ " + valorFormatado + " em " + dataHora;
        historico.appendChild(novaTransacao);

        // Armazena a transação no localStorage associada ao cliente logado
        var transacoes = JSON.parse(localStorage.getItem(clienteLogadoId)) || [];
        transacoes.push({
            tipo: tipo,
            valor: valorFormatado,
            dataHora: dataHora
        });
        localStorage.setItem(clienteLogadoId, JSON.stringify(transacoes));
    } else {
        document.getElementById('mensagem').innerText = "Por favor, insira um valor válido.";
    }
}

// Carrega o histórico de transações ao iniciar (se houver)
function carregarHistorico(filtroTipo = null) {
    var transacoes = JSON.parse(localStorage.getItem(clienteLogadoId)) || [];
    var historico = document.getElementById('historico');
    historico.innerHTML = ''; // Limpa o histórico atual

    transacoes.forEach(function(transacao) {
        if (!filtroTipo || transacao.tipo === filtroTipo) {
            var novaTransacao = document.createElement('li');
            novaTransacao.textContent = transacao.tipo + " de R$ " + transacao.valor + " em " + transacao.dataHora;
            historico.appendChild(novaTransacao);
        }
    });
}

function limparHistorico() {
    // Remove as transações do localStorage
    localStorage.removeItem(clienteLogadoId);

    // Limpa o histórico visual
    var historico = document.getElementById('historico');
    historico.innerHTML = '';

    // Exibe uma mensagem informando que o histórico foi limpo
    document.getElementById('mensagem').innerText = "Histórico de transações limpo com sucesso!";
}

// Chame carregarHistorico quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarHistorico();
});
