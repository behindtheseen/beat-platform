import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Beat {
  id: string
  title: string
  bpm: number
  key: string
  genre: string
  price: number
  exclusive_price?: number
  cover_url: string
  audio_url: string
  producer_id: string
  is_exclusive?: boolean
}

export interface CartItem extends Beat {
  licenseType: 'basic' | 'exclusive'
}

interface CartStore {
  items: CartItem[]
  addItem: (beat: Beat, licenseType: 'basic' | 'exclusive') => void
  removeItem: (beatId: string, licenseType: 'basic' | 'exclusive') => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (beat, licenseType) => {
        const existingIndex = get().items.findIndex(
          item => item.id === beat.id && item.licenseType === licenseType
        )
        
        if (existingIndex === -1) {
          set({ items: [...get().items, { ...beat, licenseType }] })
        }
      },
      
      removeItem: (beatId, licenseType) => {
        set({
          items: get().items.filter(
            item => !(item.id === beatId && item.licenseType === licenseType)
          )
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      total: () => {
        return get().items.reduce((sum, item) => {
          const price = item.licenseType === 'exclusive' 
            ? (item.exclusive_price || item.price * 3) 
            : item.price
          return sum + price
        }, 0)
      },
    }),
    {
      name: 'beat-cart',
    }
  )
)
