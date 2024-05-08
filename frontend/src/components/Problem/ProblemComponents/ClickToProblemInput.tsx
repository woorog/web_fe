import clickSrc from '@/assets/click.svg';
import ErrorView from './ErrorView';

interface ClickToQuizInputProps {
  handleClick: () => void;
  error: Error | null;
}

export default function ClickToQuizInput({ handleClick, error }: ClickToQuizInputProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1 px-2 pt-2">
      <button type="button" className="flex flex-col items-center justify-center w-full h-full" onClick={handleClick}>
        <div className="flex items-center justify-center ">
          <img src={clickSrc} width="20px" alt="clickIcon" />
          <div>URL쓰고 Enter</div>
        </div>
        {error && <ErrorView error={error} />}
      </button>
    </div>
  );
}
