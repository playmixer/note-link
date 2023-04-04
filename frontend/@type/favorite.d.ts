interface TagI {
    id: number
    name: string
}

interface FavoriteI {
    id: number
    name: string
    text: string
    tags: TagI[]
    url: string
}
