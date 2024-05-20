import bjSrc from '../../../assets/baekjoon-insert.png';
import ErrorView from './ErrorView';

interface ClickToQuizInputProps {
  handleClick: () => void;
  error: Error | null;
}

export default function ClickToQuizInput({ handleClick, error }: ClickToQuizInputProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1 px-2 pt-2">
      <button type="button" className="flex flex-col items-center justify-center w-full h-full" onClick={handleClick}>
        <img src={bjSrc} style={{ width: '100%' }} alt="clickIcon" />
        {error && <ErrorView error={error} />}
      </button>
    </div>
  );
}