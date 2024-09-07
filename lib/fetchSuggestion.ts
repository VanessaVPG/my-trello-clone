import { formatTodoForAI } from "./formatTodoForAI";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodoForAI(board);
    console.log('Formatados para enviar: ', todos);

    try {
        const res = await fetch("/api/generateSummary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ todos }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Erro na solicitação:', errorData);
            throw new Error(`Erro ${res.status}: ${errorData.message}`);
        }

        const GPTdata = await res.json();
        const { message } = GPTdata;
        const { content } = message;
        return content;
    } catch (error) {
        console.error('Erro ao buscar sugestão:', error);
        throw error;
    }
}

export default fetchSuggestion;
