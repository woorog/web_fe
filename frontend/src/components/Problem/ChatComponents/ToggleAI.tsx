interface ToggleAiProps {
  usingAi: boolean;
  setUsingAi: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ToggleAi({ usingAi, setUsingAi }: ToggleAiProps) {
  const handleChangeMessageType = () => {
    setUsingAi((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-3 font-light whitespace-nowrap">
      <button
        onClick={handleChangeMessageType}
        type="button"
        className={`relative flex w-12 h-6 gap-3 mb-2 ml-1 rounded-full ${
          usingAi ? 'bg-gray-300' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute w-5 h-5 ml-4 transition-[margin-left_1s_ease_in] bg-white rounded-full top-0.5 ${
            usingAi ? 'left-2.5' : '-left-3.5'
          }`}
        />
      </button>
      <span className="text-xs">CLOVA AI 사용</span>
    </div>
  );
}
