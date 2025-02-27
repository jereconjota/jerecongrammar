'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GrammarCorrector() {
  const [inputSentence, setInputSentence] = useState('')
  const [correctedSentence, setCorrectedSentence] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('ollama')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: inputSentence, provider: selectedProvider }),
      })

      if (!response.ok) {
        throw new Error('Failed to correct grammar')
      }

      const data = await response.json()
      setCorrectedSentence(data.correctedSentence)
    } catch (error) {
      console.error('Error:', error)
      setCorrectedSentence('An error occurred while correcting the grammar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Grammar Corrector</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            placeholder="Enter a sentence to correct..."
          />
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger>
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ollama">Ollama (Local)</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Correcting...' : 'Correct Grammar'}
          </Button>
        </form>
      </CardContent>
      {correctedSentence && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Corrected Sentence:</h3>
            <p className="text-gray-700">{correctedSentence}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}