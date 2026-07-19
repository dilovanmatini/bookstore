export const OrderStatus = Object.freeze({
    Draft: 'draft',
    Pending: 'pending',
    InProgress: 'in_progress',
    OnTheWay: 'on_the_way',
    Delivered: 'delivered',
    Cancelled: 'cancelled',
});

export const AdminUpdatableStatuses = Object.freeze([
    OrderStatus.InProgress,
    OrderStatus.OnTheWay,
    OrderStatus.Delivered,
    OrderStatus.Cancelled,
]);
