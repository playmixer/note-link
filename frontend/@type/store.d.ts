type TypeView = "favorites" | "editFavorite"

interface ApplicationStore {
    currentView: TypeView
}

interface FavoriteStore {
    filter: string[]
    update: boolean
}

interface RootStore {
    application: ApplicationStore
    favorite: FavoriteStore
}
