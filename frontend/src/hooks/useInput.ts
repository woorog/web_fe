// import { useState } from 'react';

// const useInput = (initialState: string) => {
//   const [value, setValue] = useState(initialState);
//   const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(event.target.value);
//   };
//   const onReset = () => setValue(initialState);
//   return { value, onChange, onReset };
// };

// export default useInput;

import { useState } from 'react';

const useInput = <T extends HTMLInputElement | HTMLTextAreaElement>(initialState: string) => {
  const [value, setValue] = useState(initialState);

  const onChange = (event: React.ChangeEvent<T>) => {
    setValue(event.target.value);
  };

  const onReset = () => setValue(initialState);

  return { value, onChange, onReset };
};

export default useInput;