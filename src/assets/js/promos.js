const promos = []

for (let i = 0; i < 10000; i++) {
  const paddedNumber = i.toString().padStart(4, '0')
  promos.push(`PROMO${paddedNumber}`)
}

export default promos
