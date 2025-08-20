import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { Notifier } from 'src/components/Notifier'
import ue from '@testing-library/user-event'

const userEvent = ue.setup({
	advanceTimers: jest.advanceTimersByTime,
})
describe('Окно оповещения', () => {
	it('автоматически исчезает с экрана через 1 секунду', async () => {
		const fn = jest.fn()

		render(
			<Notifier
				open={true}
				task='Любая задача'
				onClose={fn}
			/>
		)

		jest.runAllTimers()

		expect(fn).toBeCalled()
	})
	it('одновременно может быть только одно оповещение', () => {
		const onCloseMock = jest.fn()

		const { rerender } = render(
			<Notifier
				open={true}
				task='Первое оповещение'
				onClose={onCloseMock}
			/>
		)

		expect(screen.getByText('Первое оповещение')).toBeInTheDocument()
		expect(screen.queryByText('Второе оповещение')).not.toBeInTheDocument()

		rerender(
			<Notifier
				open={true}
				task='Второе оповещение'
				onClose={onCloseMock}
			/>
		)

		expect(screen.queryByText('Первое оповещение')).not.toBeInTheDocument()
		expect(screen.getByText('Второе оповещение')).toBeInTheDocument()
	})

	it('при выполнении задачи должно появляться оповещение', async () => {
		const onCloseMock = jest.fn()
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

		const { rerender } = render(
			<Notifier
				open={true}
				task='Задача "Написать тесты" завершена'
				onClose={onCloseMock}
			/>
		)

		expect(
			screen.getByText('Задача "Написать тесты" завершена')
		).toBeInTheDocument()

		act(() => {
			jest.advanceTimersByTime(1000)
		})

		expect(onCloseMock).toHaveBeenCalledTimes(1)

		rerender(
			<Notifier
				open={true}
				task='Задача "Исправить баги" завершена'
				onClose={onCloseMock}
			/>
		)

		expect(
			screen.getByText('Задача "Исправить баги" завершена')
		).toBeInTheDocument()
	})

	it('корректно отображает переданный текст задачи', () => {
		const onCloseMock = jest.fn()
		const taskText = 'Задача "Купить молоко" завершена'

		render(
			<Notifier
				open={true}
				task={taskText}
				onClose={onCloseMock}
			/>
		)

		expect(screen.getByText(taskText)).toBeInTheDocument()
	})

	it('корректно обрабатывает быстрые последовательные открытия/закрытия', () => {
		const onCloseMock = jest.fn()
		const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
		const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

		const { rerender } = render(
			<Notifier
				open={true}
				task='Первое оповещение'
				onClose={onCloseMock}
			/>
		)

		rerender(
			<Notifier
				open={false}
				task='Первое оповещение'
				onClose={onCloseMock}
			/>
		)

		rerender(
			<Notifier
				open={true}
				task='Второе оповещение'
				onClose={onCloseMock}
			/>
		)

		expect(clearTimeoutSpy).toHaveBeenCalled()

		act(() => {
			jest.runAllTimers()
		})

		expect(onCloseMock).toHaveBeenCalledTimes(1)

		setTimeoutSpy.mockRestore()
		clearTimeoutSpy.mockRestore()
	})
})
