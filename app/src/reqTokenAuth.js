


export function requestAccessToken(data) {
	const loginInfo = `${data}&grant_type=password`;
	return fetch(`${API_URL}Token`, {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/x-www-form-urlencoded',
		}),
		body: loginInfo,
	})
	.then((res) => res.json());
}




export function requestUserInfo(token) {
	return fetch(`${API_URL}api/participant/userinfo`, {
		method: 'GET',
		headers: new Headers({
			Authorization: `Bearer ${token}`
		})
	})
	.then((res) => res.json());
}