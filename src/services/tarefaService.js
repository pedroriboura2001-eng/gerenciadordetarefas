const URL_API = "/api/tarefas";

async function lerMensagemErro(resposta, mensagemPadrao) {
    try {
        const dados = await resposta.json();

        if (dados.erros && dados.erros.length > 0) {
            return dados.erros.join(" / ");
        }

        if (dados.erro) {
            return dados.erro;
        }

        return mensagemPadrao;
    } catch {
        return mensagemPadrao;
    }
}

export async function listarTarefas(filtros = {}) {
    const parametros = new URLSearchParams();

    if (filtros.status) {
        parametros.append("status", filtros.status);
    }
    if (filtros.prioridade) {
        parametros.append("prioridade", filtros.prioridade);
    }

    let endereco = URL_API;
    if (parametros.toString() !== "") {
        endereco = `${URL_API}?${parametros.toString()}`;
    }

    const resposta = await fetch(endereco);

    if (!resposta.ok) {
        const mensagem = await lerMensagemErro(resposta, "Não foi possível listar as tarefas");
        throw new Error(mensagem);
    }

    return resposta.json();
}

export async function buscarTarefaPorId(id) {
    const resposta = await fetch(`${URL_API}/${id}`);

    if (!resposta.ok) {
        const mensagem = await lerMensagemErro(resposta, "Tarefa não encontrada");
        throw new Error(mensagem);
    }

    return resposta.json();
}

export async function cadastrarTarefa(tarefa) {
    const resposta = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefa),
    });

    if (!resposta.ok) {
        const mensagem = await lerMensagemErro(resposta, "Não foi possível cadastrar a tarefa");
        throw new Error(mensagem);
    }

    return resposta.json();
}

export async function atualizarTarefa(id, tarefa) {
    const resposta = await fetch(`${URL_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefa),
    });

    if (!resposta.ok) {
        const mensagem = await lerMensagemErro(resposta, "Não foi possível atualizar a tarefa");
        throw new Error(mensagem);
    }

    return resposta.json();
}

export async function alterarStatusTarefa(id, novoStatus) {
    const resposta = await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
    });

    if (!resposta.ok) {
        const mensagem = await lerMensagemErro(resposta, "Não foi possível alterar o status");
        throw new Error(mensagem);
    }

    return resposta.json();
}

export async function excluirTarefa(id) {
    const resposta = await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
    });

    if (!resposta.ok) {
        const mensagem = await lerMensagemErro(resposta, "Não foi possível excluir a tarefa");
        throw new Error(mensagem);
    }
}
