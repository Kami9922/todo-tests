import { screen, waitFor } from '@testing-library/react'
import { List } from 'src/components/List'
import ue from '@testing-library/user-event'
import { NewTaskBar } from 'src/modules/NewTaskBar'
import { renderWithProviders } from '../utils/renderWithProviders'

const userEvent = ue.setup({
	advanceTimers: jest.advanceTimersByTime,
})
describe('Список задач', () => {
	it('отображение списка задач', () => {
		const onDelete = jest.fn()
		const onToggle = jest.fn()

		const items: Task[] = [
			{
				id: '1',
				header: 'купить хлеб',
				done: false,
			},
			{
				id: '2',
				header: 'купить молоко',
				done: false,
			},
			{
				id: '3',
				header: 'выгулять собаку',
				done: true,
			},
		]

		renderWithProviders(
			<List
				items={items}
				onDelete={onDelete}
				onToggle={onToggle}
			/>
		)

		items.pop()
	})

	it('Cписок не может содержать больше 10 невыполненных задач', async () => {
		const onDelete = jest.fn()
		const onToggle = jest.fn()
		const onAdd = jest.fn()

		const initialItems: Task[] = Array.from({ length: 10 }, (_, i) => ({
			id: `${i + 1}`,
			header: `Задача ${i + 1}`,
			done: false,
		}))

		renderWithProviders(
			<>
				<NewTaskBar />
				<List
					items={initialItems}
					onDelete={onDelete}
					onToggle={onToggle}
				/>
			</>
		)

		const elInput = screen.getByRole('textbox')
		const addButtonEl = screen.getByTestId('add-button')
		let checkboxes = screen.getAllByRole('checkbox', { checked: false })

		expect(checkboxes.length).toBe(10)

		expect(addButtonEl).toBeDisabled()

		await userEvent.type(elInput, 'Новая задача 11')
		await userEvent.click(addButtonEl)

		checkboxes = screen.getAllByRole('checkbox', { checked: false })
		expect(checkboxes.length).toBe(10)
		expect(onAdd).not.toHaveBeenCalled()
		expect(screen.queryByText('Новая задача 11')).not.toBeInTheDocument()
	})
})
