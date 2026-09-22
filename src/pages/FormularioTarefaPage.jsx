import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { buscarTarefaPorId, cadastrarTarefa, atualizarTarefa } from "../services/tarefaService";
import { opcoesStatus, opcoesPrioridade } from "../utils/textos";

const tarefaInicial = {
    titulo: "",
    descricao: "",
    status: "pendente",
    prioridade: "media",
    dataLimite: "",
};

export default function FormularioTarefaPage() {
    const { id } = useParams();
    const modoEdicao = Boolean(id);

    const navegar = useNavigate();

    const [tarefa, setTarefa] = useState(tarefaInicial);
    const [carregando, setCarregando] = useState(modoEdicao);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!id) {
            return;
        }

        buscarTarefaPorId(id)
            .then((dados) => {
                setTarefa({
                    titulo: dados.titulo || "",
                    descricao: dados.descricao || "",
                    status: dados.status || "pendente",
                    prioridade: dados.prioridade || "media",
                    dataLimite: dados.dataLimite ? dados.dataLimite.slice(0, 10) : "",
                });
            })
            .catch((error) => {
                setErro(error.message);
            })
            .finally(() => {
                setCarregando(false);
            });
    }, [id]);

    function alterarCampo(event) {
        const { name, value } = event.target;
        setTarefa((atual) => ({ ...atual, [name]: value }));
    }

    async function salvarTarefa(event) {
        event.preventDefault();

        if (!tarefa.titulo.trim()) {
            setErro("Informe o título da tarefa");
            return;
        }

        const dadosEnvio = {
            titulo: tarefa.titulo.trim(),
            descricao: tarefa.descricao,
            status: tarefa.status,
            prioridade: tarefa.prioridade,
        };
        if (tarefa.dataLimite) {
            dadosEnvio.dataLimite = tarefa.dataLimite;
        }

        try {
            setSalvando(true);
            setErro("");

            let mensagem = "";
            if (modoEdicao) {
                await atualizarTarefa(id, dadosEnvio);
                mensagem = "Tarefa atualizada com sucesso!";
            } else {
                await cadastrarTarefa(dadosEnvio);
                mensagem = "Tarefa cadastrada com sucesso!";
            }

            navegar("/tarefas", { state: { mensagem: mensagem } });
        } catch (error) {
            setErro(error.message);
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <main>
                <p>Carregando tarefa...</p>
            </main>
        );
    }

    return (
        <main>
            <h1>{modoEdicao ? "Editar tarefa" : "Nova tarefa"}</h1>
            {erro && <p>{erro}</p>}

            <form onSubmit={salvarTarefa}>
                <div>
                    <label>Título *</label>
                    <br />
                    <input
                        name="titulo"
                        placeholder="Ex: Estudar para a prova"
                        value={tarefa.titulo}
                        onChange={alterarCampo}
                    />
                </div>
                <br />
                <div>
                    <label>Descrição</label>
                    <br />
                    <textarea
                        name="descricao"
                        placeholder="Detalhes da tarefa"
                        value={tarefa.descricao}
                        onChange={alterarCampo}
                    />
                </div>
                <br />
                <div>
                    <label>Status</label>
                    <br />
                    <select name="status" value={tarefa.status} onChange={alterarCampo}>
                        {opcoesStatus.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                                {opcao.texto}
                            </option>
                        ))}
                    </select>
                </div>
                <br />
                <div>
                    <label>Prioridade</label>
                    <br />
                    <select name="prioridade" value={tarefa.prioridade} onChange={alterarCampo}>
                        {opcoesPrioridade.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                                {opcao.texto}
                            </option>
                        ))}
                    </select>
                </div>
                <br />
                <div>
                    <label>Data limite</label>
                    <br />
                    <input
                        type="date"
                        name="dataLimite"
                        value={tarefa.dataLimite}
                        onChange={alterarCampo}
                    />
                </div>
                <br />
                <div>
                    <button type="submit" disabled={salvando}>
                        {salvando ? "Salvando..." : modoEdicao ? "Salvar alterações" : "Cadastrar"}
                    </button>{" "}
                    <Link to="/tarefas">Cancelar</Link>
                </div>
            </form>
        </main>
    );
}
