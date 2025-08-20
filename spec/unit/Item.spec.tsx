import { screen } from '@testing-library/react'
import ue from '@testing-library/user-event'
import { Item } from 'src/components/Item' // Предполагаемый путь
import { renderWithProviders } from '../utils/renderWithProviders'

const userEvent = ue.setup({
	advanceTimers: jest.advanceTimersByTime,
})

describe('Элемент списка задач', () => {
	const mockOnDelete = jest.fn()
	const mockOnToggle = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('название не должно быть больше 32 символов', () => {
		const longTask: Task = {
			id: '1',
			header:
				'Очень длинное название задачи которое превышает лимит в 32 символа',
			done: false,
		}

		renderWithProviders(
			<Item
				{...longTask}
				onDelete={mockOnDelete}
				onToggle={mockOnToggle}
			/>
		)

		const taskText = screen.getByText(
			/Очень длинное название задачи которое превышает лимит в 32 символа/i
		)
		expect(taskText).toBeInTheDocument()

		expect(taskText.textContent?.length).toBeGreaterThan(32)
	})

	it('название не должно быть пустым', () => {
		const emptyTask: Task = {
			id: '1',
			header: '',
			done: false,
		}

		renderWithProviders(
			<Item
				{...emptyTask}
				onDelete={mockOnDelete}
				onToggle={mockOnToggle}
			/>
		)

		const label = screen.getByLabelText('')
		expect(label).toBeInTheDocument()

		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).toHaveAttribute('id', '1')
	})

	it('нельзя удалять невыполненные задачи', async () => {
		const incompletedTask: Task = {
			id: '1',
			header: 'Невыполненная задача',
			done: false,
		}

		renderWithProviders(
			<Item
				{...incompletedTask}
				onDelete={mockOnDelete}
				onToggle={mockOnToggle}
			/>
		)

		const deleteButton = screen.getByRole('button')

		expect(deleteButton).toBeDisabled()

		await userEvent.click(deleteButton)

		expect(mockOnDelete).not.toHaveBeenCalled()
	})

	it('можно удалять выполненные задачи', async () => {
		const completedTask: Task = {
			id: '1',
			header: 'Выполненная задача',
			done: true,
		}

		renderWithProviders(
			<Item
				{...completedTask}
				onDelete={mockOnDelete}
				onToggle={mockOnToggle}
			/>
		)

		const deleteButton = screen.getByRole('button')

		expect(deleteButton).toBeEnabled()

		await userEvent.click(deleteButton)

		expect(mockOnDelete).toHaveBeenCalledWith('1')
		expect(mockOnDelete).toHaveBeenCalledTimes(1)
	})

	it('отображает зачеркнутый текст для выполненных задач', () => {
		const completedTask: Task = {
			id: '1',
			header: 'Выполненная задача',
			done: true,
		}

		renderWithProviders(
			<Item
				{...completedTask}
				onDelete={mockOnDelete}
				onToggle={mockOnToggle}
			/>
		)

		const strikethroughText = screen.getByText('Выполненная задача')
		expect(strikethroughText.tagName).toBe('S')
		expect(strikethroughText).toHaveStyle('text-decoration: line-through')
	})
})
