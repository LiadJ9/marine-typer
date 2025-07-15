import type { FC } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface DropdownProps {
  title: string;
  buttons: {
    label: string;
    onClick: () => void;
  }[];
}

export const Dropdown: FC<DropdownProps> = ({ title, buttons }) => {
  return (
    <Menu>
      <MenuButton className='w-full'>{title}</MenuButton>
      <MenuItems
        transition
        className='w-44 flex flex-col bg-white/5 p-2 gap-1 rounded-lg transition ease-out data-[closed]:opacity-0 data-[enter]:duration-100'
        anchor='bottom'
      >
        {buttons.map((button) => (
          <MenuItem key={button.label}>
            <button className='block w-full px-8' onClick={button.onClick}>
              {button.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};
