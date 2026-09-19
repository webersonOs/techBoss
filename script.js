// Banco de Produtos do Catálogo
const PRODUTOS_INICIAIS = [
    { id: "computador", nome: "Computador Gamer", desc: "Ryzen 5 5500 | 16GB DDR4 | SSD 1TB | GTX 1650", preco: 150, cat: "computadores", img: "https://cdn.awsli.com.br/2500x2500/357/357447/produto/241716366/pcgamer-8djlqqllh6.jpg" },
    { id: "camera", nome: "Câmera DSLR Profissional", desc: "Sensor Premium | Lente Intercambiável | Vídeo Full HD", preco: 120, cat: "foto-video", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60" },
    { id: "projetor", nome: "Projetor HD Corporativo", desc: "Brilho Intenso | Resolução Nativa HD | Entradas HDMI", preco: 90, cat: "outros", img: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop&q=60" },
    { id: "notebook", nome: "Notebook Corporativo", desc: "Processador Slim | Longa Duração de Bateria | Design Leve", preco: 100, cat: "computadores", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60" },
    { id: "iluminacao", nome: "Kit Iluminação Estúdio", desc: "Softboxes Completos | Tripés Ajustáveis | Lâmpadas de Estúdio", preco: 70, cat: "foto-video", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSICFS1WFtcJQkfSXjXdq6HrYcSnRv9hQ4gzg&s" },
    { id: "tablet", nome: "Tablet Pro com Caneta", desc: "Tela de Alta Resolução | Caneta Stylus Ativa | Ideal para Design", preco: 80, cat: "outros", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEo8fZ0jNic7YbFGcYuEb2WVwm0TSem3aQPQ&s" }
];

// Estado global e persistência via localStorage
let estoque = JSON.parse(localStorage.getItem('lt_estoque')) || {
    computador: 5, camera: 5, projetor: 5, notebook: 5, iluminacao: 5, tablet: 5
};
let locacoes = JSON.parse(localStorage.getItem('lt_locacoes')) || [];
let usuariosCadastrados = JSON.parse(localStorage.getItem('lt_usuarios')) || [];
let carrinhoDeCompras = []; // Guarda os itens salvos na sessão atual de compras

let usuarioLogadoEmail = "";
let usuarioLogadoNome = "";

// Elementos DOM - Autenticação
const telaLogin = document.getElementById('telaLogin');
const conteudoSite = document.getElementById('conteudoSite');
const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');
const loginEmail = document.getElementById('loginEmail');
const loginSenha = document.getElementById('loginSenha');
const abaIrParaLogin = document.getElementById('abaIrParaLogin');
const abaIrParaCadastro = document.getElementById('abaIrParaCadastro');

// Elementos DOM - Interface
const painelAdmin = document.getElementById('painelAdminDashboard');
const visaoCliente = document.getElementById('visaoClienteContainer');
const nomeUsuarioNav = document.getElementById('nomeUsuarioNav');
const btnLogout = document.getElementById('btnLogout');
const toggleTheme = document.getElementById('toggleTheme');
const formReserva = document.getElementById('formReserva');
const inputBusca = document.getElementById('inputBusca');
const containerProdutos = document.getElementById('containerProdutos');
const campoRetirada = document.getElementById('dataRetirada');
const campoDevolucao = document.getElementById('dataDevolucao');

// Trava de calendário (não permite datas passadas)
campoRetirada.min = new Date().toISOString().split('T')[0];

// Controle das Abas de Login/Cadastro
abaIrParaLogin.addEventListener('click', () => {
    abaIrParaLogin.classList.add('ativa');
    abaIrParaLogin.classList.remove('text-muted');
    abaIrParaCadastro.classList.remove('ativa');
    abaIrParaCadastro.classList.add('text-muted');
    formLogin.classList.remove('d-none');
    formCadastro.classList.add('d-none');
});

abaIrParaCadastro.addEventListener('click', () => {
    abaIrParaCadastro.classList.add('ativa');
    abaIrParaCadastro.classList.remove('text-muted');
    abaIrParaLogin.classList.remove('ativa');
    abaIrParaLogin.classList.add('text-muted');
    formCadastro.classList.remove('d-none');
    formLogin.classList.add('d-none');
});

// Evento: Registro de Contas Comuns
formCadastro.addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('cadNome').value.trim();
    const email = document.getElementById('cadEmail').value.trim().toLowerCase();
    const senha = document.getElementById('cadSenha').value;

    if (email === "weberson@01") {
        alert("Este e-mail é reservado para a gerência!");
        return;
    }

    if (usuariosCadastrados.find(u => u.email === email)) {
        alert("E-mail já registrado no sistema.");
        return;
    }

    usuariosCadastrados.push({ nome, email, senha });
    localStorage.setItem('lt_usuarios', JSON.stringify(usuariosCadastrados));
    alert("Conta criada com sucesso! Faça seu login.");
    formCadastro.reset();
    abaIrParaLogin.click();
});

// Evento: Processamento do Login
formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailDigitado = loginEmail.value.trim().toLowerCase();
    const senhaDigitada = loginSenha.value;

    if (emailDigitado === "weberson@01") {
        if (senhaDigitada !== "81985521") {
            alert("Senha master incorreta!");
            return;
        }
        usuarioLogadoEmail = "weberson@01";
        usuarioLogadoNome = "weberson (Gerente)";
        
        montarPainelAdminVisual();
        painelAdmin.style.display = 'block';
        nomeUsuarioNav.textContent = usuarioLogadoNome;
        atualizarDashboardData();
    } else {
        const conta = usuariosCadastrados.find(u => u.email === emailDigitado && u.senha === senhaDigitada);
        if (!conta) {
            alert("Credenciais incorretas.");
            return;
        }
        usuarioLogadoEmail = conta.email;
        usuarioLogadoNome = conta.nome;
        painelAdmin.style.display = 'none';
        nomeUsuarioNav.textContent = `Olá, ${usuarioLogadoNome.split(' ')[0]}`;
    }

    telaLogin.style.display = 'none';
    conteudoSite.style.display = 'block';
    
    document.getElementById('nome').value = usuarioLogadoNome;
    document.getElementById('email').value = usuarioLogadoEmail;
    renderizarCatalogo();
});

// Injeção de Estrutura do Dashboard do Gerente
function montarPainelAdminVisual() {
    painelAdmin.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2>📊 Painel Demonstrativo Mensal</h2>
        <span class="badge bg-primary fs-6 py-2 px-3">Modo: Diretor Geral</span>
      </div>
      <div class="row text-white mb-5">
        <div class="col-md-4 mb-3"><div class="card bg-success border-0 shadow-sm p-4"><div class="small text-uppercase fw-bold opacity-75">Lucro Gerado no Mês</div><div class="fs-1 fw-bold my-2" id="dashLucroTotal">R$ 0,00</div><div class="small">Soma de contratos ativos</div></div></div>
        <div class="col-md-4 mb-3"><div class="card bg-primary border-0 shadow-sm p-4"><div class="small text-uppercase fw-bold opacity-75">Total de Alocações</div><div class="fs-1 fw-bold my-2" id="dashTotalLocados">0</div><div class="small">Produtos retirados</div></div></div>
        <div class="col-md-4 mb-3"><div class="card bg-info border-0 shadow-sm p-4"><div class="small text-uppercase fw-bold opacity-75">Ticket Médio</div><div class="fs-1 fw-bold my-2" id="dashTicketMedio">R$ 0,00</div><div class="small">Média por cliente</div></div></div>
      </div>
      <div class="card shadow-sm border p-4 mb-4">
        <h4 class="mb-3 text-dark custom-card-title">📋 Relatório de Auditoria e Contratos</h4>
        <div class="table-responsive bg-white rounded">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-dark"><tr><th>Item Alocado</th><th>Valor do Contrato</th><th>Período</th><th>Cliente Responsável</th><th>E-mail</th></tr></thead>
            <tbody id="tabelaAdminCorpo"></tbody>
          </table>
          <p id="adminHistoricoVazio" class="text-muted text-center mt-3 mb-0">Nenhuma alocação registrada no sistema.</p>
        </div>
      </div>
    `;
}

// Renderização dos cards do catálogo
function renderizarCatalogo(filtroTexto = "", filtroCat = "todos") {
    containerProdutos.innerHTML = "";
    
    const filtrados = PRODUTOS_INICIAIS.filter(p => {
        const bateTexto = p.nome.toLowerCase().includes(filtroTexto.toLowerCase()) || p.desc.toLowerCase().includes(filtroTexto.toLowerCase());
        const bateCat = filtroCat === "todos" || p.cat === filtroCat;
        return bateTexto && bateCat;
    });

    if (filtrados.length === 0) {
        containerProdutos.innerHTML = `<p class="text-muted text-center py-5">Nenhum equipamento encontrado.</p>`;
        return;
    }

    filtrados.forEach(p => {
        const qtdEstoque = estoque[p.id];
        const badgeClasse = qtdEstoque > 0 ? "bg-success" : "bg-danger";
        
        const cardHtml = `
            <div class="col-md-6 col-xl-4 mb-4">
              <div class="card shadow-sm h-100">
                <img src="${p.img}" class="card-img-top img-produto" alt="${p.nome}">
                <div class="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 class="card-title">${p.nome}</h5>
                    <p class="text-muted small mb-1">${p.desc}</p>
                    <p class="card-text mb-1 fw-bold text-primary">R$ ${p.preco.toFixed(2).replace('.', ',')}/dia</p>
                  </div>
                  <span class="badge ${badgeClasse} mt-2 p-2">Disponíveis: ${qtdEstoque}</span>
                </div>
              </div>
            </div>
        `;
        containerProdutos.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// Listeners de Busca e Filtragem
inputBusca.addEventListener('input', (e) => {
    const catAtiva = document.querySelector('.btn-filtro.active').getAttribute('data-categoria');
    renderizarCatalogo(e.target.value, catAtiva);
});

document.querySelectorAll('.btn-filtro').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderizarCatalogo(inputBusca.value, this.getAttribute('data-categoria'));
    });
});

// Orçamento em tempo real da diária selecionada
function calcularOrcamentoPrevia() {
    const equipamentoSelect = document.getElementById('equipamento');
    const resumoPreco = document.getElementById('resumoPreco');
    
    if (!campoRetirada.value || !campoDevolucao.value || !equipamentoSelect.value) {
        resumoPreco.classList.add('d-none');
        return;
    }

    const d1 = new Date(campoRetirada.value);
    const d2 = new Date(campoDevolucao.value);
    const dias = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));

    if (dias <= 0) {
        resumoPreco.className = "alert alert-danger text-center p-2 mb-3";
        resumoPreco.innerHTML = "Erro: Retirada deve ser antes da devolução.";
        resumoPreco.classList.remove('d-none');
        return;
    }

    const precoDiaria = parseFloat(equipamentoSelect.options[equipamentoSelect.selectedIndex].getAttribute('data-preco'));
    const total = dias * precoDiaria;

    resumoPreco.className = "alert alert-info text-center p-2 mb-3";
    resumoPreco.innerHTML = `Período: <span class="fw-bold">${dias}</span> dia(s) | Parcial: <span class="fw-bold">R$ ${total.toFixed(2).replace('.', ',')}</span>`;
    resumoPreco.classList.remove('d-none');
}

campoRetirada.addEventListener('change', function() {
    if (this.value) {
        campoDevolucao.disabled = false;
        campoDevolucao.min = this.value;
    } else {
        campoDevolucao.disabled = true;
    }
    calcularOrcamentoPrevia();
});
campoDevolucao.addEventListener('change', calcularOrcamentoPrevia);
document.getElementById('equipamento').addEventListener('change', calcularOrcamentoPrevia);

// ======================================================== -->
// OPERAÇÃO LOGÍSTICA DO CARRINHO DE COMPRAS                 -->
// ======================================================== -->

function abrirFecharCarrinho() {
    const janela = document.getElementById('janelaCarrinho');
    const overlay = document.getElementById('carrinhoOverlay');
    
    // Customização de cor para o Modo Escuro na janela retrátil
    if (document.body.classList.contains('dark-theme')) {
        janela.style.background = '#1e1e1e';
    } else {
        janela.style.background = '#ffffff';
    }

    if (janela.style.display === 'block') {
        janela.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        janela.style.display = 'block';
        overlay.style.display = 'block';
        renderizarItensCarrinho();
    }
}

// Evento: Captura o item e adiciona ao fluxo acumulativo
formReserva.addEventListener('submit', function(e) {
    e.preventDefault();
    const equipamentoSelect = document.getElementById('equipamento');
    const itemChave = equipamentoSelect.value;
    
    if (estoque[itemChave] <= 0) {
        alert('Este equipamento está sem estoque no momento!');
        return;
    }

    const d1 = new Date(campoRetirada.value);
    const d2 = new Date(campoDevolucao.value);
    const dias = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));

    if (dias <= 0) {
        alert('Selecione datas válidas para o agendamento.');
        return;
    }

    const itemTexto = equipamentoSelect.options[equipamentoSelect.selectedIndex].text.split(' - ')[0];
    const precoDiaria = parseFloat(equipamentoSelect.options[equipamentoSelect.selectedIndex].getAttribute('data-preco'));
    const valorContratoTotal = precoDiaria * dias;

    // Reserva lógica temporária do estoque
    estoque[itemChave]--;

    carrinhoDeCompras.push({
        id: Date.now(),
        chave: itemChave,
        item: itemTexto,
        precoTotal: valorContratoTotal,
        periodo: `${campoRetirada.value.split('-').reverse().join('/')} até ${campoDevolucao.value.split('-').reverse().join('/')}`,
        dias: dias
    });

    document.getElementById('carrinhoContador').textContent = carrinhoDeCompras.length;
    document.getElementById('resumoPreco').classList.add('d-none');
    
    formReserva.reset();
    document.getElementById('nome').value = usuarioLogadoNome;
    document.getElementById('email').value = usuarioLogadoEmail;
    campoDevolucao.disabled = true;

    alert(`${itemTexto} guardado no carrinho! Pode prosseguir comprando.`);
    renderizarCatalogo();
});

// Desenha a listagem interna do carrinho lateral
function renderizarItensCarrinho() {
    const listaHtml = document.getElementById('listaItensCarrinho');
    listaHtml.innerHTML = '';
    
    if (carrinhoDeCompras.length === 0) {
        listaHtml.innerHTML = '<li class="list-group-item text-muted text-center bg-transparent border-0">O carrinho está vazio.</li>';
        document.getElementById('carrinhoTotal').textContent = 'R$ 0,00';
        return;
    }

    carrinhoDeCompras.forEach(item => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 border-bottom py-2";
        
        // Define contraste de cor dinâmico
        const corTexto = document.body.classList.contains('dark-theme') ? '#fff' : '#000';
        
        li.innerHTML = `
            <div style="max-width: 80%; color: ${corTexto};">
                <div class="fw-bold small">${item.item}</div>
                <small class="text-muted d-block" style="font-size:0.75rem;">${item.periodo} (${item.dias} dias)</small>
                <span class="text-primary fw-bold small">R$ ${item.precoTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <button onclick="removerDoCarrinhoLateral(${item.id}, '${item.chave}')" class="btn btn-danger btn-sm px-2 py-0">✕</button>
        `;
        listaHtml.appendChild(li);
    });

    recalcularPrecoFinal();
}

// Remove o item de dentro do carrinho e reajusta estoque
function removerDoCarrinhoLateral(idItem, chaveProduto) {
    carrinhoDeCompras = carrinhoDeCompras.filter(item => item.id !== idItem);
    estoque[chaveProduto]++;
    
    document.getElementById('carrinhoContador').textContent = carrinhoDeCompras.length;
    renderizarItensCarrinho();
    renderizarCatalogo();
}

// Alterna a exibição das seções de pagamento
function alternarCamposPagamento() {
    const forma = document.querySelector('input[name="carrinhoPagamento"]:checked').value;
    document.getElementById('camposPix').style.display = (forma === 'Pix') ? 'block' : 'none';
    document.getElementById('camposCartao').style.display = (forma === 'Cartão') ? 'block' : 'none';
    document.getElementById('camposBoleto').style.display = (forma === 'Boleto') ? 'block' : 'none';
    
    recalcularPrecoFinal();
}

// Aplica regras de preço com descontos correspondentes
function recalcularPrecoFinal() {
    let subtotal = carrinhoDeCompras.reduce((acc, item) => acc + item.precoTotal, 0);
    const forma = document.querySelector('input[name="carrinhoPagamento"]:checked').value;

    if (forma === 'Pix') {
        subtotal = subtotal * 0.95; // Desconto de 5%
    }

    document.getElementById('carrinhoTotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// Finalização completa do carrinho de compras
function finalizarCarrinho() {
    if (carrinhoDeCompras.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const formaPagamento = document.querySelector('input[name="carrinhoPagamento"]:checked').value;

    carrinhoDeCompras.forEach(item => {
        let liquido = item.precoTotal;
        if (formaPagamento === 'Pix') liquido = liquido * 0.95;

        locacoes.push({
            item: `${item.item} (${formaPagamento})`,
            precoTotal: liquido,
            periodo: item.periodo,
            cliente: usuarioLogadoNome,
            email: usuarioLogadoEmail
        });
    });

    localStorage.setItem('lt_estoque', JSON.stringify(estoque));
    localStorage.setItem('lt_locacoes', JSON.stringify(locacoes));

    let confirmacaoMsg = `🚀 Compra Concluída com sucesso!\n\nProcessados: ${carrinhoDeCompras.length} equipamento(s).\nForma de Pagamento: ${formaPagamento}`;
    if (formaPagamento === 'Pix') {
        confirmacaoMsg += `\n\nChave Pix Copia e Cola:\npix-locatech-contrato-${Date.now()}`;
    } else if (formaPagamento === 'Boleto') {
        confirmacaoMsg += `\n\nCódigo de barras enviado para o e-mail cadastrado.`;
    }

    alert(confirmacaoMsg);

    carrinhoDeCompras = [];
    document.getElementById('carrinhoContador').textContent = '0';
    abrirFecharCarrinho();
    renderizarCatalogo();
    
    if (usuarioLogadoEmail === "luiz@02") atualizarDashboardData();
}

// Atualização de dados da área administrativa do Gerente
function atualizarDashboardData() {
    const corpoTabela = document.getElementById('tabelaAdminCorpo');
    const vazioAviso = document.getElementById('adminHistoricoVazio');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = '';

    if (locacoes.length === 0) {
        vazioAviso.style.display = 'block';
        document.getElementById('dashLucroTotal').textContent = 'R$ 0,00';
        document.getElementById('dashTotalLocados').textContent = '0';
        document.getElementById('dashTicketMedio').textContent = 'R$ 0,00';
        return;
    }

    vazioAviso.style.display = 'none';
    let faturamento = 0;

    locacoes.forEach(loc => {
        faturamento += loc.precoTotal;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${loc.item}</strong></td>
            <td>R$ ${loc.precoTotal.toFixed(2).replace('.', ',')}</td>
            <td>${loc.periodo}</td>
            <td>${loc.cliente}</td>
            <td><span class="text-muted">${loc.email}</span></td>
        `;
        corpoTabela.appendChild(tr);
    });

    document.getElementById('dashLucroTotal').textContent = `R$ ${faturamento.toFixed(2).replace('.', ',')}`;
    document.getElementById('dashTotalLocados').textContent = locacoes.length;
    document.getElementById('dashTicketMedio').textContent = `R$ ${(faturamento / locacoes.length).toFixed(2).replace('.', ',')}`;
}

// Sistema de Desconexão (Logout)
btnLogout.addEventListener('click', function() {
    telaLogin.style.display = 'flex';
    conteudoSite.style.display = 'none';
    painelAdmin.innerHTML = '';
    formLogin.reset();
    formCadastro.reset();
    formReserva.reset();
    abaIrParaLogin.click();
    document.getElementById('resumoPreco').classList.add('d-none');
    carrinhoDeCompras = [];
    document.getElementById('carrinhoContador').textContent = '0';
});

// Chaveador do Modo Escuro
toggleTheme.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    this.textContent = document.body.classList.contains('dark-theme') ? "☀️ Modo Claro" : "🌙 Modo Escuro";
});
