import { gsap } from 'gsap'

export default defineNuxtPlugin(() => {
  gsap.defaults({
    duration: 0.45,
    ease: 'power2.out',
  })

  return {
    provide: {
      gsap,
    },
  }
})
