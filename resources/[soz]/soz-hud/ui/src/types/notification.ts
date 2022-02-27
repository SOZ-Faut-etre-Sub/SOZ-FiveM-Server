export type BasicNotification = {
    id: string
    message: string
    delay?: number
    flash?: boolean
}
export type AdvancedNotification = BasicNotification & {
    title: string
    subtitle: string
    image: string
}
