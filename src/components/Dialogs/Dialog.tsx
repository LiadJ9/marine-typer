import { type FC, type ReactNode } from 'react';
import {
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

interface DialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title?: string;
  children: (isOpen: boolean, setIsOpen: (open: boolean) => void) => ReactNode;
}

export const Dialog: FC<DialogProps> = ({
  setIsOpen,
  isOpen,
  title,
  children,
}) => {
  return (
    <>
      <HeadlessDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'
        transition
      >
        <div className='fixed inset-0 flex w-screen items-center justify-center p-4 '>
          <DialogPanel className='max-w-2xl space-y-2 outline-6 outline-slate-800 rounded-2xl bg-sky-900'>
            {title && <DialogTitle className='font-bold'>{title}</DialogTitle>}
            {children(isOpen, setIsOpen)}
          </DialogPanel>
        </div>
      </HeadlessDialog>
    </>
  );
};
