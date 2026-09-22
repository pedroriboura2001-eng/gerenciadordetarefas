import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <main>
            <h1>Gerenciador de Tarefas</h1>
            <p>
                Trabalho de React que consome a API
            </p>
            <ul>
                <li>
                    <Link to="/tarefas">Ver lista de tarefas</Link>
                </li>
                <li>
                    <Link to="/tarefas/nova">Cadastrar uma tarefa nova</Link>
                </li>
            </ul>
        </main>
    );
}
