import path from 'path'

export interface LoadConfigFunctionParams {
  destPath: string
}

export default ({ destPath }: LoadConfigFunctionParams) => {
  destPath = path.resolve(destPath)
}
