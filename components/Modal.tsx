'use client'
import { ChangeEvent, FormEvent, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '@/store/ModalStore'
import { useBoardStore } from '@/store/BoardStore'
import { TaskTypeRadioGroup } from './TaskTypeRadioGroup'
import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/solid'
export function Modal() {

    const imagePickerRef = useRef<HTMLInputElement>(null);
    const [image, setImage, newTaskInput, setNewTaskInput] = useBoardStore((state) => [
        state.image,
        state.setImage,
        state.newTaskInput,
        state.setNewTaskInput,
    ]);

    const [isOpen, closeModal] = useModalStore((state) => [state.isOpen, state.closeModal]);


    const handleImageUpload = (e:ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files![0].type.startsWith('image/')) return;
            setImage(e.target.files![0]);
    }

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTaskInput) return;
        setImage(null);
        closeModal();
    }


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as='form'
                onSubmit={handleSubmit}
                className='relative z-10'
                onClose={closeModal}>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900 pb-2'>
                                    Adicionar uma tarefa
                                </Dialog.Title>
                                <div className='mt-2'>
                                    <input
                                        type="text"
                                        value={newTaskInput}
                                        onChange={(e) => setNewTaskInput(e.target.value)}
                                        placeholder='Digite o nome da tarefa'
                                        className='w-full rounded-md border border-gray-300 outline-none p-5 '
                                    />
                                    <TaskTypeRadioGroup />
                                    <div className='mt-2'>
                                        <button
                                            type='button'
                                            onClick={() => imagePickerRef.current?.click()}
                                            className='w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-offset-2'>
                                            <PhotoIcon className='w-6 h-6 mr-2 inline-block' />
                                            Adicionar imagem
                                        </button>

                                        {image && (
                                            <Image
                                                alt='Imagem da tarefa'
                                                width={200}
                                                height={200}
                                                className='w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed'
                                                src={URL.createObjectURL(image)}
                                                onClick={() => { setImage(null) }}
                                            />
                                        )}
                                        <input
                                            type='file'
                                            ref={imagePickerRef}
                                            hidden
                                            onChange={handleImageUpload}
                                        />

                                    </div>


                                </div>
                                <div className='mt-4'>
                                    <button
                                    type='submit'
                                    disabled={!newTaskInput}
                                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed'
                                    >
                                        Adicionar Tarefa
                                    </button>

                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>

            </Dialog>
        </Transition>
    )
}