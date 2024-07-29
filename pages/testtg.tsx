// pages/testtg.tsx

import React, { useState, FormEvent } from 'react';

export default function TestTelegram() {
	const [message, setMessage] = useState('');
	const [result, setResult] = useState(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const response = await fetch('/api/tg/telegram', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message })
		});
		const data = await response.json();
		setResult(data);
	};

	return (
		<div>
			<h1>Test Telegram Notification</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Enter message"
				/>
				<button type="submit">Send Notification</button>
			</form>
			{result && (
				<div>
					<h2>Result:</h2>
					<pre>{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}
