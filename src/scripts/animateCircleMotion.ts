const normAngle = (a: number) => {
  if (Math.PI * 2 <= a) {
    a -= Math.PI * 2
  }

  if (0 > a) {
    a += Math.PI * 2
  }

  return a
}

export default function (
  startAngle: number,
  endAngle: number,
  motionRadius: number,
  duration: number,
  handler: (angle: number) => void
) {
  const delay = 10

  const speed = 1

  const coefficient = duration / delay

  const direction = Math.abs(endAngle - startAngle) > Math.PI ? -1 : 1

  if (direction === -1) startAngle += Math.PI * 2

  let angle = normAngle(Math.abs(endAngle - startAngle))

  if (angle > Math.PI) angle -= Math.PI

  const anglePart = angle / coefficient

  let i = 1

  const interval = setInterval(() => {
    let currentAngle = startAngle + anglePart * i * direction

    const tempAngle = normAngle(currentAngle)
    const tempEndAngle = normAngle(endAngle)

    const isProcess = Math.abs(tempEndAngle - tempAngle) > 0.02 //angle > Math.PI ? endAngle < currentAngle : endAngle > currentAngle

    if (isProcess) {
      handler(currentAngle)
    } else {
      clearInterval(interval)

      currentAngle = normAngle(endAngle)

      handler(currentAngle)
    }

    i++
  }, delay * speed)
}
