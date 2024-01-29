const SERVER = new URL("http://localhost:8000/")

export async function SendPost(path, body){
    const req = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    }

    const res = await fetch(SERVER + path, req)
    const json = await res.json()
    
    return json
}
