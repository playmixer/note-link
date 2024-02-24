const API = process.env.NODE_ENV === "development" ? "http://localhost:8000/api/v0" : process.env.PUBLIC_URL+"/api/v0";

const _fetch = async (method = "GET", url = "", data = {}): Promise<Response> => {
    let content: any = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
    }
    if (method !== 'GET') {
        content['body'] =JSON.stringify(data)
    }
    return fetch(API + url, content)
}

const _get = async (url = "") => {
    return _fetch("GET", url, {})
}

const _post = async (url = "", data = {}) => {
    return _fetch("POST", url, data)
}

const _delete = async (url = "", data = {}) => {
    return _fetch("DELETE", url, data)
}

const _update = async (url = "", data = {}) => {
    return _fetch("PUT", url, data)
}

const delimiter = ";"

interface ResponseSuccessI {
    success: boolean
}
interface ResponseErrorI {
    error: string
}

const api = {
    favorite: {
        get: async (id: number): Promise<FavoriteI> => {
            return _get("/favorite/"+id)
                .then(res => res.json())
        },
        all: async (tags?: string[]): Promise<FavoriteI[]> => {
            const param = tags?.length ? "tags="+tags?.join(delimiter) : ""
            return _get("/favorites?"+param)
                .then(res => res.json())
        },
        add: async (form: {name: string, text: string, url: string, tags: string[]}): Promise<ResponseSuccessI> => {
            return _post("/favorites", form)
                .then(res => res.json())
        },
        updTags: async (form: {favoriteId: number, tags: string[]}): Promise<FavoriteI> => {
            return _update(`/favorite/${form.favoriteId}/tags`, {tags: form.tags})
                .then(res => res.json())
        },
        updUrl: async (form: {favoriteId: number, url: string}): Promise<FavoriteI&ResponseErrorI> => {
            return _update(`/favorite/${form.favoriteId}/url`, {url: form.url})
                .then(res => res.json())
        },
        remove: async (id: number): Promise<ResponseSuccessI&ResponseErrorI> => {
            return _delete("/favorite/"+id, {})
                .then(res => res.json())
        },
        update: async (form: FavoriteI): Promise<FavoriteI&ResponseErrorI> => {
            return _update(`/favorite/${form.id}`, form)
                .then(res => res.json())
        }
    },
    tag: {
        all: async (): Promise<TagI[]> => {
            return _get("/tags")
                .then(res => res.json())
        },
        add: async (name: string): Promise<TagI&ResponseErrorI> => {
            return _post("/tags", {name})
                .then(res => res.json())
        },
        remove: async (id: number): Promise<ResponseSuccessI&ResponseErrorI> => {
            return _delete("/tag/"+id, {})
                .then(res => res.json())
        }
    }
}

export default api
