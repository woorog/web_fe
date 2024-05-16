import { ErrorData } from './ChatTypes';

interface ChatErrorToastProps {
  errorData: ErrorData;
  setErrorData: React.Dispatch<React.SetStateAction<ErrorData | null>>;
}

export default function ChattingErrorToast({ errorData, setErrorData }: ChatErrorToastProps) {
  return (
    <div className="absolute z-10 flex flex-col items-start w-full bottom-28 ">
      <div className="flex flex-col p-5 mb-5 ml-5 drop-shadow-lg bg-base">
        <span className="text-sm">{errorData.text1}</span>
        <span className="text-sm">{errorData.text2}</span>
        <div
          className="absolute bottom-0 left-0 flex-grow w-full h-2 bg-point-blue animate-[toast_3s_linear_forwards]"
          onAnimationEnd={() => setErrorData(null)}
        />
      </div>
    </div>
  );
}
