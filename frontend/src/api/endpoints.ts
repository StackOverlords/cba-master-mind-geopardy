export const endpoints = {
    users: "users",
    category: "category",
    question: "question",
    game: "game",
    auth: "auth",
    permission: "permission",
}
export const userEndpoints = {
    getAll: "users",
    create: "users/create",
    update: (uuid: string) => `users/${uuid}/update`,
    delete: (id: string) => `users/${id}/delete`,
    userByFirebaseId: (id: string) => `users/firebase/${id}`,
}
export const categoryEndpoints = {
    getAll: "category",
    create: "category/create",
    update: (id: string) => `category/${id}/update`,
    delete: (id: string) => `category/${id}/delete`,
}
export const questionEndpoints = {
    getAll: "question",
    create: "question/create",
    update: (id: string) => `question/${id}/update`,
    delete: (id: string) => `question/${id}/delete`,
    import_excel: "question/import-excel"
}
export const gameEndpoints = {
    getAll: "game",
    create: "game/create",
    update: (id: string) => `game/${id}/update`,
    delete: (id: string) => `game/${id}/delete`,
}
export const permissionEndpoints = {
    getAll: "permission",
    create: "permission/create",
    update: (id: string) => `permission/${id}/update`,
    delete: (id: string) => `permission/${id}/delete`,
}