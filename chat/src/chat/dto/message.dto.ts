export class MessageDto {
  room: string;
  message: string;
  nickname: string;
  ai: boolean;
  ///
  execInput: boolean;
  execOutput?: string;
  execId?: string;
}
