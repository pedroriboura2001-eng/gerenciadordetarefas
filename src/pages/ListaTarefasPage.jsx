import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { listarTarefas, excluirTarefa, alterarStatusTarefa } from "../services/tarefaService";
import { opcoesStatus, opcoesPrioridade, textoStatus, textoPrioridade, formatarData } from "../utils/textos";

export default function ListaTarefasPage() {
    const [tarefas, setTarefas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [filtros, setFiltros] = useState({ status: "", prioridade: "" });
    const [excluindoId, setExcluindoId] = useState(null);
    const [recarregar, setRecarregar] = useState(0);

    const navegar = useNavigate();

    const localizacao = useLocation();
    const mensagemSucesso = localizacao.state?.mensagem;

    useEffect(() => {
        listarTarefas(filtros)
            .then((dados) => {
                setTarefas(dados);
                setErro("");
            })
            .catch((error) => {
                setErro(error.message);
            })
            .finally(() => {
                setCarregando(false);
            });
    }, [filtros, recarregar]);

    function alterarFiltro(event) {
        const { name, value } = event.target;
        setCarregando(true);
        setFiltros((atual) => ({ ...atual, [name]: value }));
    }

    function limparFiltros() {
        setCarregando(true);
        setFiltros({ status: "", prioridade: "" });
    }

    function atualizarLista() {
        setCarregando(true);
        setRecarregar((valor) => valor + 1);
    }

    async function removerTarefa(tarefa) {
        const confirmou = window.confirm(`Deseja realmente excluir a tarefa "${tarefa.titulo}"?`);
        if (!confirmou) {
            return;
        }

        try {
            setExcluindoId(tarefa.id);
            setErro("");
            await excluirTarefa(tarefa.id);

            setTarefas((atual) => atual.filter((item) => item.id !== tarefa.id));
        } catch (error) {
            setErro(error.message);
        } finally {
            setExcluindoId(null);
        }
    }

    async function avancarStatus(tarefa) {
        let proximoStatus = "pendente";
        if (tarefa.status === "pendente") {
            proximoStatus = "em_andamento";
        } else if (tarefa.status === "em_andamento") {
            proximoStatus = "concluida";
        }

        try {
            setErro("");
            const tarefaAtualizada = await alterarStatusTarefa(tarefa.id, proximoStatus);

            setTarefas((atual) =>
                atual.map((item) => (item.id === tarefaAtualizada.id ? tarefaAtualizada : item))
            );
        } catch (error) {
            setErro(error.message);
        }
    }

    return (
        <main>
            <h1>Tarefas</h1>
            {mensagemSucesso && <p>{mensagemSucesso}</p>}
            {erro && <p>{erro}</p>}

            <button type="button" onClick={() => navegar("/tarefas/nova")}>
                + Nova tarefa
            </button>
            <section>
                <h2>Filtrar</h2>
                <label>
                    Status:{" "}
                    <select name="status" value={filtros.status} onChange={alterarFiltro}>
                        <option value="">Todos</option>
                        {opcoesStatus.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                                {opcao.texto}
                            </option>
                        ))}
                    </select>
                </label>{" "}

                <label>
                    Prioridade:{" "}
                    <select name="prioridade" value={filtros.prioridade} onChange={alterarFiltro}>
                        <option value="">Todas</option>
                        {opcoesPrioridade.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                                {opcao.texto}
                            </option>
                        ))}
                    </select>
                </label>{" "}

                <button type="button" onClick={limparFiltros}>Limpar filtros</button>{" "}
                <button type="button" onClick={atualizarLista}>Atualizar</button>
            </section>
            <section>
                <h2>Tarefas cadastradas</h2>
                {carregando ? (
                    <p>Carregando...</p>
                ) : tarefas.length === 0 ? (
                    <p>Nenhuma tarefa encontrada.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Status</th>
                                <th>Prioridade</th>
                                <th>Data limite</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tarefas.map((tarefa) => (
                                <tr key={tarefa.id}>
                                    <td>{tarefa.titulo}</td>
                                    <td>{textoStatus(tarefa.status)}</td>
                                    <td>{textoPrioridade(tarefa.prioridade)}</td>
                                    <td>{formatarData(tarefa.dataLimite)}</td>
                                    <td>
                                        <Link to={`/tarefas/${tarefa.id}`}>Detalhes</Link>{" "}
                                        <button type="button" onClick={() => navegar(`/tarefas/editar/${tarefa.id}`)}>
                                            Editar
                                        </button>{" "}
                                        <button type="button" onClick={() => avancarStatus(tarefa)}>
                                            Mudar status
                                        </button>{" "}
                                        <button
                                            type="button"
                                            onClick={() => removerTarefa(tarefa)}
                                            disabled={excluindoId === tarefa.id}
                                        >
                                            {excluindoId === tarefa.id ? "Excluindo..." : "Excluir"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </main>
    );
}
