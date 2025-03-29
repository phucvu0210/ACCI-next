import { toast } from "sonner"

interface IRequest {
  _model: string
  _method: "PUT" | "GET" | "POST" | "DELETE"
  _relation?: string[]
  _where?: object
}

interface IResponse {
  isSuccess: boolean
  data: unknown | string
}

export async function createRequest(data: IRequest) {
  data._model = data._model.toLowerCase();
  const response: IResponse = await Promise.resolve()
    .then(() => fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }))
    .then((data) => data.json())
  
  if (!response.isSuccess) {
    const message = (response.data as string).includes('\n') ? (response.data as string).split('\n').pop() : response.data
    toast(message as string);
    return null
  }
  
  return response.data;
}