import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { Fragment, ReactNode } from 'react'

type ModalProps = {
  children: ReactNode
  show: boolean
  title: string
  toggle: (value: boolean) => void
}

const Modal: React.FC<ModalProps> = ({
  children,
  show,
  title = '',
  toggle,
}) => {
  return (
    <Transition appear as={Fragment} show={show}>
      <Dialog
        className="fixed inset-0 z-50 overflow-y-auto text-gray-800"
        onClose={toggle}
      >
        <div className="flex items-center justify-center h-screen p-5">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <span aria-hidden="true" className="inline-block align-middle">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-block p-10 my-10 space-y-5 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-900 rounded shadow-xl">
              <Dialog.Title
                as="h2"
                className="text-xl font-bold leading-5 dark:text-white"
              >
                {title}
              </Dialog.Title>
              {children}
              <button
                className="absolute top-0 outline-none right-5 dark:text-gray-400"
                onClick={() => toggle(!show)}
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
