import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Empty } from 'src/components/Empty'
import { FilterButton } from 'src/components/FilterButton'
import { List } from 'src/components/List'
import {
	deleteTask,
	tasksSelector,
	toggleTask,
	completeCount,
} from '../store/taskSlice'

export const TaskList = () => {
	const [hideCompleted, setHideCompleted] = useState(false)
	const allItems = useSelector(tasksSelector)
	const complete = useSelector(completeCount)
	const dispatch = useDispatch()

	const filteredItems = hideCompleted
		? allItems.filter((item) => !item.done)
		: allItems

	const handleDelete = (id: Task['id']) => {
		dispatch(deleteTask(id))
	}

	const handleToggle = (id: Task['id']) => {
		dispatch(toggleTask(id))
	}

	const toggleFilter = () => {
		setHideCompleted(!hideCompleted)
	}

	return (
		<>
			<FilterButton
				onClick={toggleFilter}
				text={hideCompleted ? 'Показать все' : 'Скрыть выполненные'}
				disabled={complete > 0 ? false : true}
			/>
			{filteredItems.length > 0 ? (
				<List
					items={filteredItems}
					onDelete={handleDelete}
					onToggle={handleToggle}
				/>
			) : (
				<Empty />
			)}
		</>
	)
}
