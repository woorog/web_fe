import React, { useCallback } from 'react';
import { InviteModal } from '../InviteModal';
import useModal from '../../../hooks/useModal';

const PageButtons = () => {
  const { isShowing, toggle } = useModal();

  const invite = useCallback(() => {
    toggle();
  }, [toggle]);

  return (
    <div className="flex items-center">
      <button
        onClick={invite}
        className="w-full text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-600 dark:bg-sublime-dark-grey-blue dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
      >
        <span className="">초대 URL 복사</span>
      </button>
      <InviteModal isShowing={isShowing} setIsShowing={toggle} />
    </div>
  );
};

export default PageButtons;
