import { databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    searchString: string;
    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
    setSearchString: (searchString: string) => void;
    setNewTaskType: (columnId: TypedColumn) => void;
    setNewTaskInput: (newTaskInput: string) => void;
    setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    image: null,
    searchString: '',
    newTaskInput: '',
    newTaskType: 'todo',
    setSearchString: (searchString) => set({ searchString }),

    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },

    setBoardState: (board) => set({ board }),

    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
        const newColumns = new Map(get().board.columns);

        //deletar o todoId do newColumns

        newColumns.get(id)?.todos.splice(taskIndex, 1);

        set({ board: { columns: newColumns } });

        if(todo.image) {	
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        );

    },

    setNewTaskInput: (input: string) => set({ newTaskInput:input }),
    setNewTaskType: (columnId:TypedColumn) => set({ newTaskType: columnId }),
    setImage: (image: File | null) => set({ image }),


    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        )
    }

}))
