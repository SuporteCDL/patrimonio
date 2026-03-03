export function ZeroLeft(value: string, size: number) {
  let add = ''
  if (value.length < size) {
    const rest = size - value.length
    for (let i = 1; i <= rest; i++) {
      add += '0'
    }
  }
  return add + value
}

//===========================================
export function formatDateForDB(date: Date) {
  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, "0") // Janeiro = 0
  const dia = String(date.getDate()).padStart(2, "0")
  const horas = String(date.getHours()).padStart(2, "0")
  const minutos = String(date.getMinutes()).padStart(2, "0")
  const segundos = String(date.getSeconds()).padStart(2, "0")
  const milissegundos = String(date.getMilliseconds()).padStart(3, "0")

  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}.${milissegundos}`
}

