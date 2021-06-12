import * as React from 'react'
import { ComponentType, createElement, PropsWithChildren } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

export function ReactModuleRoot({ children }: PropsWithChildren<any>) {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}

export function wrapRoot(componentType: ComponentType) {
  return createElement(ReactModuleRoot, {}, createElement(componentType))
}
