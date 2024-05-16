// import React, { useCallback } from 'react';
// import { InviteModal } from '../InviteModal';
// import useModal from '../../../hooks/useModal';

// const Button = ({ name, callback }: { name: string; callback: any }) => {
//   return (
//       <button
//           onClick={callback}
//           className="w-full h-full flex items-center justify-center py-4 bg-white border border-gray-400 hover:bg-teal-100 focus:bg-white active:bg-white active:translate-y-1 active:shadow-inner font-medium tracking-widest text-center"
//       >
//           <span>{name}</span>
//       </button>
//   );
// };

// const PageButtons = () => {
//     const {isShowing, toggle} = useModal();

//     const invite = useCallback(() => {
//         toggle();
//     }, [toggle]);

//     return (
//         <>
//             <Button name="초대" callback={invite}/>
//             <InviteModal isShowing={isShowing} />
//       </>
//   );
// };

// export default PageButtons;

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
        className="relative flex items-center justify-center py-2 px-6 bg-black text-white border border-gray-400 font-bold tracking-widest text-center text-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:bg-white hover:text-black shadow-lg rounded-full"
      >
        <span className="animate-pulse font-extrabold">초대</span>
      </button>
      <InviteModal isShowing={isShowing} setIsShowing={toggle} />
    </div>
  );
};

export default PageButtons;