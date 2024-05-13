import { Tldraw, track, useEditor } from 'tldraw';
import { useYjsStore } from './useYjsStore';
import 'tldraw/tldraw.css';
import './index.css';

// 환경별 호스트 URL 설정 : 개발 중에는 로컬 웹소켓 서버를 사용하고,
// 프로덕션에는 demos.yjs.dev의 웹소켓 서버를 사용합니다.
const HOST_URL =
	import.meta.env.MODE === 'development'
		? 'ws://localhost:3334'
		: 'wss://demos.yjs.dev'

// YjsExample 컴포넌트는 tldraw 편집기를 렌더링
export default function YjsExample() {
	const store = useYjsStore({
		roomId: 'example17',		//  특정 roomId를 사용하여 문서 공간을 구분
		hostUrl: HOST_URL,			// 동기화를 위한 서버의 URL
	})

	// tldraw 컴포넌트는 store를 통해 상태를 관리하고, 사용자 지정 컴포넌트를 렌더링하는 옵션을 제공
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
	)
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
