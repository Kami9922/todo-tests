type Props = {
	onClick: () => void
	text: string
	disabled?: boolean
}
export const FilterButton = ({ onClick, text, disabled }: Props) => {
	return (
		<button
			className='button'
			onClick={onClick}
			disabled={disabled}
			data-alt='Отфильтовать задачи'
			data-testid='filter-button'>
			{text}
		</button>
	)
}
