import { screen } from '@testing-library/react'
import ue from '@testing-library/user-event'
import { renderWithProviders } from '../utils/renderWithProviders'
import { NewTaskBar } from 'src/modules/NewTaskBar'
import { TaskList } from 'src/modules/TaskList'

const userEvent = ue.setup({
	advanceTimers: jest.advanceTimersByTime,
})

describe('Список задач', () => {
	it('с включенным фильтром', async () => {
		renderWithProviders(
			<>
				<NewTaskBar />
				<TaskList />
			</>
		)

		const inputEl = screen.getByRole('textbox')
		const addBtnEl = screen.getByAltText(/Добавить/i)

		await userEvent.type(inputEl, 'Задача 1')
		await userEvent.click(addBtnEl)

		await userEvent.type(inputEl, 'Задача 2')
		await userEvent.click(addBtnEl)

		const checkboxes = screen.getAllByRole('checkbox')
		await userEvent.click(checkboxes[1])

		const filterBtn = screen.getByTestId('filter-button')
		await userEvent.click(filterBtn)

		const visibleCheckboxes = screen.getAllByRole('checkbox')
		expect(visibleCheckboxes).toHaveLength(1)
	})
	it('с выключенным фильтром', async () => {
		renderWithProviders(
			<>
				<NewTaskBar />
				<TaskList />
			</>
		)

		const inputEl = screen.getByRole('textbox')
		const addBtnEl = screen.getByAltText(/Добавить/i)

		await userEvent.type(inputEl, 'Задача 1')
		await userEvent.click(addBtnEl)

		await userEvent.type(inputEl, 'Задача 2')
		await userEvent.click(addBtnEl)

		const checkboxes = screen.getAllByRole('checkbox')
		await userEvent.click(checkboxes[1])

		const filterBtn = screen.getByTestId('filter-button')
		await userEvent.click(filterBtn)
		await userEvent.click(filterBtn)

		const visibleItems = screen.getAllByRole('listitem')
		expect(visibleItems).toHaveLength(2)
	})
})
