import { configureStore, combineReducers } from '@reduxjs/toolkit'
import taskListReducer from './taskSlice'
import { loadState, saveState } from 'src/utils/persist'

const rootReducer = combineReducers({
	taskList: taskListReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) => {
	return configureStore({
		reducer: rootReducer,
		devTools: true,
		preloadedState,
	})
}

const persistedState = loadState() as Partial<RootState>
export const store = setupStore(persistedState)

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

store.subscribe(() => {
	saveState({
		...store.getState(),
	})
})
