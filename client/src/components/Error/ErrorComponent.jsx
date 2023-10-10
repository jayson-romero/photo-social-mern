import "./ErrorComponent.css"

const ErrorComponent = ({ message }) => {
	return (
		<div className="error-container">
			<p className="error-message">{message}</p>
		</div>
	)
}

export default ErrorComponent
