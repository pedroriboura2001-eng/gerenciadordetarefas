import { NavLink } from "react-router-dom";

export default function Menu() {
    return (
        <header>
            <strong>Gerenciador de Tarefas</strong>
            <nav>
                <NavLink to="/">Início</NavLink>
                {" | "}
                <NavLink to="/tarefas" end>Tarefas</NavLink>
                {" | "}
                <NavLink to="/tarefas/nova">Nova tarefa</NavLink>
            </nav>
            <hr />
        </header>
    );
}
