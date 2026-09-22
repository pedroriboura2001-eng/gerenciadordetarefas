import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import HomePage from "./pages/HomePage";
import ListaTarefasPage from "./pages/ListaTarefasPage";
import FormularioTarefaPage from "./pages/FormularioTarefaPage";
import DetalheTarefaPage from "./pages/DetalheTarefaPage";
import NaoEncontradaPage from "./pages/NaoEncontradaPage";

export default function App() {
    return (
        <>
            <Menu />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tarefas" element={<ListaTarefasPage />} />
                <Route path="/tarefas/nova" element={<FormularioTarefaPage />} />
                <Route path="/tarefas/editar/:id" element={<FormularioTarefaPage />} />
                <Route path="/tarefas/:id" element={<DetalheTarefaPage />} />
                <Route path="*" element={<NaoEncontradaPage />} />
            </Routes>
        </>
    );
}
