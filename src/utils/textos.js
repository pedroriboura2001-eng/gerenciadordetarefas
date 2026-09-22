export const opcoesStatus = [
    { valor: "pendente", texto: "Pendente" },
    { valor: "em_andamento", texto: "Em andamento" },
    { valor: "concluida", texto: "Concluída" },
];

export const opcoesPrioridade = [
    { valor: "baixa", texto: "Baixa" },
    { valor: "media", texto: "Média" },
    { valor: "alta", texto: "Alta" },
];

export function textoStatus(status) {
    const encontrado = opcoesStatus.find((opcao) => opcao.valor === status);
    return encontrado ? encontrado.texto : status;
}

export function textoPrioridade(prioridade) {
    const encontrado = opcoesPrioridade.find((opcao) => opcao.valor === prioridade);
    return encontrado ? encontrado.texto : prioridade;
}

export function formatarData(data) {
    if (!data) {
        return "-";
    }
    const partes = data.slice(0, 10).split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function formatarDataHora(dataHora) {
    if (!dataHora) {
        return "-";
    }
    return new Date(dataHora).toLocaleString("pt-BR");
}
