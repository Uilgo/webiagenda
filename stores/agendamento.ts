import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgendamentoStore = defineStore('agendamento', () => {
  const dataReferencia = ref(new Date())

  const diasSemana = computed(() => {
    const refDate = dataReferencia.value
    const startOfWeek = new Date(refDate)
    startOfWeek.setDate(refDate.getDate() - refDate.getDay())
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  })

  const avancarSemana = () => {
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() + 7)
    dataReferencia.value = novaData
  }

  const voltarSemana = () => {
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() - 7)
    dataReferencia.value = novaData
  }

  return { dataReferencia, diasSemana, avancarSemana, voltarSemana }
})