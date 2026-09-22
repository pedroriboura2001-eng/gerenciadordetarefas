import { Link } from "react-router-dom";

export default function NaoEncontradaPage() {
    return (
        <main>
            <h1>Página não encontrada</h1>
            <p>O endereço digitado não existe.</p>
            <Link to="/">Voltar para o início</Link>
        </main>
    );
}
