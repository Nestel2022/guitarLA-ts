import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
import {IGuitar, ICartItem } from "../interfaces"

export const useCart = () => {

    const initialCart = () : ICartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorage ? JSON.parse(localStorageCart!) : []
    }
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 10
    const MIN_ITEMS = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item: IGuitar) {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            const updateCart = [...cart]
            updateCart[itemExists].quantity++
            setCart(updateCart)
        } else {
            const newItem : ICartItem = {...item, quantity: 1}          
            setCart([...cart, newItem])

        }

    }

    function removeFromCart(id : IGuitar['id']) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id : IGuitar['id']) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart)

    }

    function decrementQuantity(id : IGuitar['id']) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updateCart)

    }

    function clearCart() {
        setCart([])
    }

    //state Derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart])
    const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])



    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decrementQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}

