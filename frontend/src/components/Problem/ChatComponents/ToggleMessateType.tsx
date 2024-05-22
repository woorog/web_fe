interface ToggleMessageTypeProps {
    messageType: 'human' | 'ai';
    setMessageType: React.Dispatch<React.SetStateAction<'human' | 'ai'>>;
  }
  
  export default function ToggleMessageType({ messageType, setMessageType }: ToggleMessageTypeProps) {
    const handleChangeMessageType = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMessageType(event.target.value as 'human' | 'ai');
    };
  
    return (
      <div className="flex items-center gap-3 font-light whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center ps-4 pr-4">
            <input
              id="bordered-radio-1"
              type="radio"
              value="human"
              name="bordered-radio"
              checked={messageType === 'human'}
              onChange={handleChangeMessageType}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
            />
            <label
              htmlFor="bordered-radio-1"
              className="w-full py-1 ms-2 text-sm font-medium text-neutral-950 dark:text-neutral-950"
            >
              유저
            </label>
          </div>
          <div className="flex items-center ps-4 pr-4">
            <input
              id="bordered-radio-2"
              type="radio"
              value="ai"
              name="bordered-radio"
              checked={messageType === 'ai'}
              onChange={handleChangeMessageType}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
            />
            <label
              htmlFor="bordered-radio-2"
              className="w-full py-1 ms-2 text-sm font-medium text-neutral-950 dark:text-neutral-950"
            >
              AI
            </label>
          </div>
        </div>
      </div>
    );
  }