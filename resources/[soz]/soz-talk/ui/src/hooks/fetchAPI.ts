const BASE_PATH = 'https://soz-talk'

export default function fetchAPI(path: string, data: Object = {}, callback: Function) {
    if (import.meta.env.DEV) {
        console.debug(`fetch ${path}`, data, callback)
        callback()
        return
    }

    if (path.charAt(0) !== "/") {
        path = `/${path}`
    }

    fetch(`${BASE_PATH}${path}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (response.ok) {
                response.json().then((res) => {
                    if (res === 'ok') {
                        callback()
                    }
                })
            }
        })
        .catch(error => console.error(error))
}
