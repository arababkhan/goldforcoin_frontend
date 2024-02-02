import { toast } from 'react-toastify'

export const notifySuccess = (text: string) => {
  toast.success(text, { autoClose: 500, theme: 'colored' })
}
export const notifyError = (text: string, err?: Error) => {
  toast.error(text, { autoClose: 500, theme: 'colored' })
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}
