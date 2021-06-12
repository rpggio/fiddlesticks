import { Variant } from '@samuelmeuli/font-manager'

export function defaultVariant(variants: Variant[]) {
  return variants.find(it => it === 'regular') || variants[0]
}
