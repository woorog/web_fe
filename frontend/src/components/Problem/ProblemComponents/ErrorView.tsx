import { isAxiosError } from 'axios';

export default function ErrorView({ error }: { error: Error }): JSX.Element | null {
  if (isAxiosError(error)) {
    if (error.response && error.response.status === 500) {
      return <div className="font-bold text-point-red animate-[vibration_.5s_linear]">오류가 발생했습니다!</div>;
    } else if (error.response && error.response.status === 404) {
      return <div className="font-bold text-point-red animate-[vibration_.5s_linear]">백준 문제를 찾을 수 없습니다!</div>;
    }
  }
  return null;
}
