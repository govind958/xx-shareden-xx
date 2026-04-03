'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Stack } from '../types'

interface DnDContextType {
  dragItem: Stack | null
  setDragItem: (item: Stack | null) => void
}

const DnDContext = createContext<DnDContextType | undefined>(undefined)

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [dragItem, setDragItem] = useState<Stack | null>(null)

  return (
    <DnDContext.Provider value={{ dragItem, setDragItem }}>
      {children}
    </DnDContext.Provider>
  )
}

export const useDnD = (): [Stack | null, (item: Stack | null) => void] => {
  const context = useContext(DnDContext)
  if (context === undefined) {
    throw new Error('useDnD must be used within a DnDProvider')
  }
  return [context.dragItem, context.setDragItem]
}

