import { formatTodoForAI } from "./formatTodoForAI";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodoForAI(board);
    console.log('formatados para enviar' + todos)

    const res = await fetch("/api/generateSummary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ todos }),
    });

    const GPTdata = await res.json();
    const { message } = GPTdata;
    const { content } = message;
    return content;
}
export default fetchSuggestion;