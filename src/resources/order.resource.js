export const OrderResource = (order) => {
    return {
        id: order._id,
        userId: order.userId,
        orderDate: order.orderDate,
        status: order.status,
        totalPrice: order.totalPrice,
        items: order.items.map((item) => ({
            id: item.bookId._id,
            title: item.bookId.title,
            author: item.bookId.author,
            price: item.bookId.price,
            imageUrl: item.bookId.imageUrl,
            quantity: item.quantity,
            price: item.price,
        })),
    }
}

export const OrdersCollection = (orders, query = {}) => {
    return {
        data: orders.map(OrderResource),
        meta: {
            page: query.page || 1,
            limit: query.limit || 10,
            totalOrders: orders.length,
        },
    }
}
