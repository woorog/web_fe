import { Tldraw, track, useEditor } from 'tldraw';
import { VITE_SOCKET_CANVAS_URL } from '../../constants/env';
import { useYjsStore } from './useYjsStore';
import 'tldraw/tldraw.css';
import './index.css';

interface CanvasProps {
	roomNumber: string;
}

const HOST_URL = VITE_SOCKET_CANVAS_URL;

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

const NameEditor = track(() => {
	const editor = useEditor()
	const { color, name } = editor.user.getUserPreferences()

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
