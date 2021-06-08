import {Observable} from 'rxjs'
import {useEffect, useState} from 'react'

export function useObservableState<T>(state$: Observable<T>) {
  const [state, setState] = useState<T>()
  useEffect(() => {
    const sub = state$.subscribe(setState)
    return () => sub.unsubscribe()
  }, [state$])
  return state
}
