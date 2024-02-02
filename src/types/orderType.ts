export interface Product {
    weight: number
    price: number
    quantity: number
    cost: number
}

export interface Order {
    orderId?: number
    user: string
    email: string
    phone: string
    country: string
    address: string
    city: string
    code: string
    prod_kind: string
    chain: number
    coin: string
    shipfee: number
    cost: number
    paid?: number
    transaction?: string
    status: string
    created?: Date
    products: Product[] 
}