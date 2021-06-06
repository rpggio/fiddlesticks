
import {Observable} from 'rxjs'
import {cloneElement, PropsWithChildren, useState} from 'react'

type Props<T> = {
  state$: Observable<T>
} & PropsWithChildren<any>

export function StreamComponent<T>({ state$, children }: Props<T>) {
  const [state, setState] = useState<T>()
  state$.observe(setState)
  return cloneElement(children, { data: state })
}
