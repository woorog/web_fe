// whiteboard에서 roomId를 Problem.tsx에서 받아와야 하지만, 현재는 example로 하드코딩되어 있음.
// 데이터의 형태를 잘 모르겠어서 일단 보류 일단 console.log로는 안찍힘

import {
	InstancePresenceRecordType,
	TLAnyShapeUtilConstructor,
	TLInstancePresence,
	TLRecord,
	TLStoreWithStatus,
	computed,
	createPresenceStateDerivation,
	createTLStore,
	defaultShapeUtils,
	defaultUserPreferences,
	getUserPreferences,
	setUserPreferences,
	react,
	SerializedSchema,
} from 'tldraw'
import { useEffect, useMemo, useState } from 'react'
import { YKeyValue } from 'y-utility/y-keyvalue'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

// 사용자정의 훅 정의
export function useYjsStore({
	roomId = 'example',
	hostUrl = 'wss://demos.yjs.dev',
	shapeUtils = [],
}: Partial<{
	hostUrl: string
	roomId: string
	version: number
	shapeUtils: TLAnyShapeUtilConstructor[]
}>) {
	// 스토어 초기화
	const [store] = useState(() => {
		const store = createTLStore({
			shapeUtils: [...defaultShapeUtils, ...shapeUtils],
		})

		return store
	})

	// 스토어 상태 관리
	const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
		status: 'loading',
	})

	// Yjs Document 및 웹 소켓 연결 설정
	const { yDoc, yStore, meta, room } = useMemo(() => {
		const yDoc = new Y.Doc({ gc: true })
		const yArr = yDoc.getArray<{ key: string; val: TLRecord }>(`tl_${roomId}`)
		const yStore = new YKeyValue(yArr)
		const meta = yDoc.getMap<SerializedSchema>('meta')

		return {
			yDoc,
			yStore,
			meta,
			room: new WebsocketProvider(hostUrl, roomId, yDoc, { connect: true }),
		}
	}, [hostUrl, roomId])

	// 실시간 동기화 효과 관리
	useEffect(() => {
		setStoreWithStatus({ status: 'loading' })
		const unsubs: (() => void)[] = []

		// 스토어와 Yjs 스토어 동기화 설정, 스토어 변경사항을 Yjs 문서에 동기화
		function handleSync() {
			// 1.
			// Connect store to yjs store and vis versa, for both the document and awareness

			/* -------------------- Document -------------------- */

			// Sync store changes to the yjs doc
			unsubs.push(
				store.listen(
					function syncStoreChangesToYjsDoc({ changes }) {
						yDoc.transact(() => {
							Object.values(changes.added).forEach((record) => {
								yStore.set(record.id, record)
							})

							Object.values(changes.updated).forEach(([_, record]) => {
								yStore.set(record.id, record)
							})

							Object.values(changes.removed).forEach((record) => {
								yStore.delete(record.id)
							})
						})
					},
					{ source: 'user', scope: 'document' }, // only sync user's document changes
				),
			)

			// Yjs 문서 변경사항을 스토어에 동기화
			const handleChange = (
				changes: Map<
					string,
					| { action: 'delete'; oldValue: TLRecord }
					| { action: 'update'; oldValue: TLRecord; newValue: TLRecord }
					| { action: 'add'; newValue: TLRecord }
				>,
				transaction: Y.Transaction,
			) => {
				if (transaction.local) return

				const toRemove: TLRecord['id'][] = []
				const toPut: TLRecord[] = []

				changes.forEach((change, id) => {
					switch (change.action) {
						case 'add':
						case 'update': {
							const record = yStore.get(id)!
							toPut.push(record)
							break
						}
						case 'delete': {
							toRemove.push(id as TLRecord['id'])
							break
						}
					}
				})

				// put / remove the records in the store
				store.mergeRemoteChanges(() => {
					if (toRemove.length) store.remove(toRemove)
					if (toPut.length) store.put(toPut)
				})
			}

			yStore.on('change', handleChange)
			unsubs.push(() => yStore.off('change', handleChange))

			/* -------------------- Awareness ------------------- */
			// 유저 상태 변화 감지 및 동기화
			const yClientId = room.awareness.clientID.toString()
			setUserPreferences({ id: yClientId })

			const userPreferences = computed<{
				id: string
				color: string
				name: string
			}>('userPreferences', () => {
				const user = getUserPreferences()
				return {
					id: user.id,
					color: user.color ?? defaultUserPreferences.color,
					name: user.name ?? defaultUserPreferences.name,
				}
			})

			// Create the instance presence derivation
			const presenceId = InstancePresenceRecordType.createId(yClientId)
			const presenceDerivation = createPresenceStateDerivation(
				userPreferences,
				presenceId,
			)(store)

			// Set our initial presence from the derivation's current value
			room.awareness.setLocalStateField('presence', presenceDerivation.get())

			// When the derivation change, sync presence to to yjs awareness
			unsubs.push(
				react('when presence changes', () => {
					const presence = presenceDerivation.get()
					requestAnimationFrame(() => {
						room.awareness.setLocalStateField('presence', presence)
					})
				}),
			)

			// Awareness 관련 업데이트를 처리
			const handleUpdate = (update: {
				added: number[]
				updated: number[]
				removed: number[]
			}) => {
				const states = room.awareness.getStates() as Map<
					number,
					{ presence: TLInstancePresence }
				>

				const toRemove: TLInstancePresence['id'][] = []
				const toPut: TLInstancePresence[] = []

				// 추가, 업데이트, 제거된 클라이언트의 presence 정보를 처리
				for (const clientId of update.added) {
					const state = states.get(clientId)
					if (state?.presence && state.presence.id !== presenceId) {
						toPut.push(state.presence)
					}
				}

				for (const clientId of update.updated) {
					const state = states.get(clientId)
					if (state?.presence && state.presence.id !== presenceId) {
						toPut.push(state.presence)
					}
				}

				for (const clientId of update.removed) {
					toRemove.push(
						InstancePresenceRecordType.createId(clientId.toString()),
					)
				}

				// put / remove the records in the store, 스토어에 변경 사항을 병합
				store.mergeRemoteChanges(() => {
					if (toRemove.length) store.remove(toRemove)
					if (toPut.length) store.put(toPut)
				})
			}

			// 메타 데이터 업데이트 관찰 및 처리
			const handleMetaUpdate = () => {
				const theirSchema = meta.get('schema')
				if (!theirSchema) {
					throw new Error('No schema found in the yjs doc')
				}
				// If the shared schema is newer than our schema, the user must refresh
				// 공유된 스키마가 우리의 스키마보다 새로운 경우 사용자가 페이지를 새로 고침
				const newMigrations = store.schema.getMigrationsSince(theirSchema)

				if (!newMigrations.ok || newMigrations.value.length > 0) {
					window.alert('The schema has been updated. Please refresh the page.')
					yDoc.destroy()
				}
			}
			meta.observe(handleMetaUpdate)
			unsubs.push(() => meta.unobserve(handleMetaUpdate))

			room.awareness.on('update', handleUpdate)
			unsubs.push(() => room.awareness.off('update', handleUpdate))

			// 2.
			// Initialize the store with the yjs doc records—or, if the yjs doc
			// is empty, initialize the yjs doc with the default store records.
			// 스토어를 yjs 문서 레코드로 초기화하거나, yjs 문서가 비어있으면 기본 스토어 레코드로
			if (yStore.yarray.length) {
				// Replace the store records with the yjs doc records, 스토어 레코드를 yjs 문서 레코드로 대체
				const ourSchema = store.schema.serialize()
				const theirSchema = meta.get('schema')
				if (!theirSchema) {
					throw new Error('No schema found in the yjs doc')
				}

				const records = yStore.yarray.toJSON().map(({ val }) => val)

				const migrationResult = store.schema.migrateStoreSnapshot({
					schema: theirSchema,
					store: Object.fromEntries(
						records.map((record) => [record.id, record]),
					),
				})
				if (migrationResult.type === 'error') {
					// if the schema is newer than ours, the user must refresh
					console.error(migrationResult.reason)
					window.alert('The schema has been updated. Please refresh the page.')
					return
				}

				yDoc.transact(() => {
					// delete any deleted records from the yjs doc
					for (const r of records) {
						if (!migrationResult.value[r.id]) {
							yStore.delete(r.id)
						}
					}
					for (const r of Object.values(migrationResult.value) as TLRecord[]) {
						yStore.set(r.id, r)
					}
					meta.set('schema', ourSchema)
				})

				store.loadSnapshot({
					store: migrationResult.value,
					schema: ourSchema,
				})
			} else {
				// 초기 스토어 레코드를 생성하고 yjs 문서와 동기화
				// Create the initial store records
				// Sync the store records to the yjs doc
				yDoc.transact(() => {
					for (const record of store.allRecords()) {
						yStore.set(record.id, record)
					}
					meta.set('schema', store.schema.serialize())
				})
			}

			setStoreWithStatus({
				store,
				status: 'synced-remote',
				connectionStatus: 'online',
			})
		}

		// 연결 상태 변경을 처리
		let hasConnectedBefore = false

		function handleStatusChange({
			status,
		}: {
			status: 'disconnected' | 'connected'
		}) {
			// If we're disconnected, set the store status to 'synced-remote' and the connection status to 'offline'
			if (status === 'disconnected') {
				setStoreWithStatus({
					store,
					status: 'synced-remote',
					connectionStatus: 'offline',
				})
				return
			}

			room.off('synced', handleSync)

			if (status === 'connected') {
				if (hasConnectedBefore) return
				hasConnectedBefore = true
				room.on('synced', handleSync)
				unsubs.push(() => room.off('synced', handleSync))
			}
		}

		room.on('status', handleStatusChange)
		unsubs.push(() => room.off('status', handleStatusChange))

		// 구독 해지 함수를 반환하여 메모리 누수를 방지
		return () => {
			unsubs.forEach((fn) => fn())
			unsubs.length = 0
		}
	}, [room, yDoc, store, yStore, meta])

	return storeWithStatus		// 최종적으로 상태가 포함된 스토어를 반환
}
