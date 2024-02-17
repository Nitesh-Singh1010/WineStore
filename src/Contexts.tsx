import { createContext } from 'react'

interface IConfigJson {
  [key: string]: any
}
interface ILangJson {
  [key: string]: any
}

export type IAppStateContext = {
  appConfig: IConfigJson
  loading: boolean
  setLoader: (loading: boolean, label?: string) => void
}
export type IAppLangContext = {
  appLang: ILangJson
}

export const AppStateContext = createContext<IAppStateContext>(
  {} as IAppStateContext
)
export const AppLangContext = createContext<IAppLangContext>(
  {} as IAppLangContext
)
