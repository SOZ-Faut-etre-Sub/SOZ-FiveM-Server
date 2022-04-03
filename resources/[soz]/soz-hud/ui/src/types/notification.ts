export type BasicNotification = {
    id: string
    message: string
    delay?: number
    style?: string
}
export type AdvancedNotification = BasicNotification & {
    title: string
    subtitle: string
    image: string
}
