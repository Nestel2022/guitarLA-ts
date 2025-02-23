export interface IGuitar  {
    id : number
    name: string
    image: string
    description: string
    price: number
  }

export interface ICartItem extends IGuitar{
  quantity: number
}

