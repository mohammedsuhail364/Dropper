import { addCartItemRequest, addCartItemSuccess } from "../slices/cartSlices"
import axios from 'axios'
export const addCartItmes=(id,quantity)=>async(dispatch)=>{
    try {
        dispatch(addCartItemRequest())
        const {data}=await axios.get(`/api/v1/product/${id}`)
        dispatch(addCartItemSuccess({
            product:data.product._id,
            name:data.product.name,
            price:data.product.price,
            image:data.product.images[0].image,
            stock:data.product.stock,
            seller:data.product.seller,
            quantity
        }))
    } catch (error) {
        
    }
}