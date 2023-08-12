'use client'
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { ChangeEvent, useEffect, useState } from "react";
import fetchSuggestion  from "@/lib/fetchSuggestion";

export function Header() {
    const [board, searchString, setSearchString] = useBoardStore((state) =>
        [
            state.board,
            state.searchString,
            state.setSearchString,
        ]
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [suggestion, setSuggestion] = useState<string[]>([]);


    useEffect(() => {
        if(board.columns.size === 0) return;
        setLoading(true);
        async function fetchSuggestionFunc() {
            const suggest = await fetchSuggestion(board);
            setSuggestion(suggest);
            setLoading(false);
        }
        fetchSuggestionFunc();
    },[board])

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearchString(event.target.value);
    };
    return (
        <header>
            <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
                <div
                    className="
                    absolute
                    top-0
                    left-0
                    w-full
                    h-96
                    bg-gradient-to-br
                    from-rose-800
                    to-blue-600
                    rounded-md
                    filter
                    blur-3xl
                    opacity-50
                    -z-50"

                />
                <Image
                    src="https://links.papareact.com/c2cdd5"
                    alt="Logo do Trello"
                    width={300}
                    height={100}
                    className="w-44 md:w-56 pb-10 md:pb-0 object-contain cursor-pointer"
                />
                <div className="flex items-center space-x-5 flex-1 justify-end w-full">
                    {/* Search */}
                    <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                        <input type="text" value={searchString} onChange={handleSearchChange} placeholder="Search" className="flex-1 outline-none p-2" />
                        <button hidden>Search</button>
                    </form>

                    {/* Avatar */}
                    <Avatar name="Vanessa Gonçalves" round size="50" color="#2563eb" />
                </div>
            </div>
            <div className="flex items-center justify-center px-5 py-2 md:py-5">
                <p className="flex items-center text-sm font-light p-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-blue-600">
                    <UserCircleIcon className={`inline-block h-10 w-10 text-blue-600 mr-1 ${loading && "animate-spin"}`} />
                    {
                    suggestion && !loading ?
                    suggestion : "O GPT está resumindo as suas tarefas..."}
                </p>
            </div>
        </header>
    )
}