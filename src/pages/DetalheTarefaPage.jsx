import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { buscarTarefaPorId, excluirTarefa } from "../services/tarefaService";
import { textoStatus, textoPrioridade, formatarData, formatarDataHora } from "../utils/textos";

export default function DetalheTarefaPage() {
    const { id } = useParams();
    const navegar = useNavigate();

    const [tarefa, setTarefa] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        buscarTarefaPorId(id)
            .then((dados) => {
                setTarefa(dados);
            })
            .catch((error) => {
                setErro(error.message);
            })
            .finally(() => {
                setCarregando(false);
            });
    }, [id]);

    async function removerTarefa() {
        const confirmou = window.confirm(`Deseja realmente excluir a tarefa "${tarefa.titulo}"?`);
        if (!confirmou) {
            return;
        }

        try {
            await excluirTarefa(tarefa.id);
            navegar("/tarefas", { state: { mensagem: "Tarefa excluída com sucesso!" } });
        } catch (error) {
            setErro(error.message);
        }
    }

    if (carregando) {
        return (
            <main>
                <p>Carregando...</p>
            </main>
        );
    }

    if (!tarefa) {
        return (
            <main>
                <p>{erro || "Tarefa não encontrada"}</p>
                <Link to="/tarefas">Voltar para a lista</Link>
            </main>
        );
    }

    return (
        <main>
            <h1>{tarefa.titulo}</h1>
            {erro && <p>{erro}</p>}

            <p><strong>Descrição:</strong> {tarefa.descricao || "Sem descrição"}</p>
            <p><strong>Status:</strong> {textoStatus(tarefa.status)}</p>
            <p><strong>Prioridade:</strong> {textoPrioridade(tarefa.prioridade)}</p>
            <p><strong>Data limite:</strong> {formatarData(tarefa.dataLimite)}</p>
            <p><strong>Criada em:</strong> {formatarDataHora(tarefa.criadoEm)}</p>
            <p><strong>Última atualização:</strong> {formatarDataHora(tarefa.atualizadoEm)}</p>
            <div>
                <button type="button" onClick={() => navegar(`/tarefas/editar/${tarefa.id}`)}>
                    Editar
                </button>{" "}
                <button type="button" onClick={removerTarefa}>
                    Excluir
                </button>{" "}
                <Link to="/tarefas">Voltar</Link>
            </div>
        </main>
    );
}
