'use client'
import { useBoardStore } from '@/store/BoardStore';
import { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { Column } from './Column';



export function Board() {
    const [getBoard, setBoardState, board, updateTodoInDB] = useBoardStore(state => [state.getBoard, state.setBoardState, state.board, state.updateTodoInDB]);
    useEffect(() => {
        getBoard();
    }, [getBoard])

    function handleOnDragEnd(result: DropResult) {
        const { destination, source, type } = result;
        // Verifica se o usuáro arrastou o item para fora da área de drop
        if (!destination) return;

        // Arrastando as colunas
        if (type === 'column') {
            const entries = Array.from(board.columns.entries());
            const [removed] = entries.splice(source.index, 1);
            entries.splice(destination.index, 0, removed);
            const rearrangedColumns = new Map(entries);
            setBoardState({ ...board, columns: rearrangedColumns });
        }

        const columns = Array.from(board.columns);
        const startColIndex = columns[Number(source.droppableId)];
        const finishColIndex = columns[Number(destination.droppableId)];

        const startCol: Column = {
            id: startColIndex[0],
            todos: startColIndex[1].todos
        }

        const finishCol: Column = {
            id: finishColIndex[0],
            todos: finishColIndex[1].todos
        };

        if (!startCol || !finishCol) return;

        if (source.index === destination.index && startCol === finishCol) return;

        const newTodos = startCol.todos;

        const [todoMoved] = newTodos.splice(source.index, 1);

        if (startCol.id === finishCol.id) {
            //arrastando para a mesma coluna
            newTodos.splice(destination.index, 0, todoMoved);
            const newCol = {
                id: startCol.id,
                todos: newTodos,
            };
            const newColumns = new Map(board.columns);
            newColumns.set(newCol.id, newCol);

            setBoardState({ ...board, columns: newColumns });
        } else {
            //arrastando para uma coluna diferente
            const finishTodos = Array.from(finishCol.todos);
            finishTodos.splice(destination.index, 0, todoMoved);
            const newColumns = new Map(board.columns);
            const newCol = {
                id: startCol.id,
                todos: newTodos,
            };

            newColumns.set(startCol.id, newCol);
            newColumns.set(finishCol.id, {
                id: finishCol.id,
                todos: finishTodos,
            });

            //atualiza o todo no banco de dados
            updateTodoInDB(todoMoved, finishCol.id);

            setBoardState({ ...board, columns: newColumns });
        }

    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd} >
            <Droppable droppableId='board' direction='horizontal' type='column'>{provided =>
                <div
                    className='grid grid-cols-1 md:grid-cols-3 gap-5  max-w-7xl mx-auto'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {
                        Array.from(board.columns.entries()).map(([id, column], index) => (
                            <Column key={id} id={id} todos={column.todos} index={index} />
                        ))
                    }
                </div>
            }

            </Droppable>

        </DragDropContext >
    )
}