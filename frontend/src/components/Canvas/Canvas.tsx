import { Tldraw, track, useEditor } from 'tldraw';
import { useYjsStore } from './useYjsStore';
import 'tldraw/tldraw.css';
import './index.css';

interface CanvasProps {
	roomNumber: string;
}

const HOST_URL = 'ws://localhost:3334'
// import.meta.env.MODE === 'development'
// 	? 'ws://localhost:3334'
// 	: 'wss://demos.yjs.dev'

export default function Canvas({ roomNumber }: CanvasProps) {
	const store = useYjsStore({
		roomId: roomNumber,
		hostUrl: HOST_URL,
	});

	return (
		<div className="tldraw__editor">
			<Tldraw
				autoFocus
				store={store}
				components={{
					SharePanel: NameEditor,
				}}
			/>
		</div>
	);
}


// Name 컴포넌트는 사용자의 이름과 색상을 설정할 수 있는 입력 필드를 제공
const NameEditor = track(() => {
	// tldraw의 편집기 훅을 사용하여 편집기 인스턴스를 가져옴
	const editor = useEditor()	

	// 현재 사용자의 선호도를 가져옴
	const { color, name } = editor.user.getUserPreferences()

	// 입력 필드를 통해 사용자 선호도를 업데이트함
	return (
		<div style={{ pointerEvents: 'all', display: 'flex' }}>
			<input
				type="color"
				value={color}
				onChange={(e) => {
					editor.user.updateUserPreferences({
						color: e.currentTarget.value,
					})
				}}
			/>
			<input
				value={name}
				onChange={(e) => {
					editor.user.updateUserPreferences({
						name: e.currentTarget.value,
					})
				}}
			/>
		</div>
	)
})
