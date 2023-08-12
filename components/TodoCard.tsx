'use client'
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd"

type TodoCardProps = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

export function TodoCard({ dragHandleProps, draggableProps, id, index, innerRef, todo }: TodoCardProps) {

    const deleteTask = useBoardStore((state) => state.deleteTask);

    return (
        <div className="bg-white rounded-md space-y-2 drop-shadow-md" {...draggableProps} {...dragHandleProps} ref={innerRef}>
            <div className="flex justify-between items-center p-5">
                <p>
                    {todo.title}
                </p>
                <button onClick={()=> deleteTask(index, todo, id)} className="text-red-500 hover:text-red-600 transition-all">
                    <XCircleIcon className="ml-5 h-8 w-8" />
                </button>
            </div>
            {/* Adicionar a imagem aqui */}
        </div>
    )
}