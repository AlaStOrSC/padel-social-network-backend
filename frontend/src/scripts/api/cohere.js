export async function getPadelAdvice(rivalStyle, comments) {
  const prompt = `Tu respuesta no debe superar las 60 palabras. Buenas, acabo de jugar un partido de pádel al mejor de 3 sets, qué puedo hacer para mejorar mi estilo de pádel de cara a próximos partidos, te paso la información del estilo del rival ${rivalStyle} y comentarios de mi partido ${comments}`;

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer UpKPz8wg6kx7wjFrXdkcz3rwzXLsEOIqrfcUF8Zv',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: 60,
        temperature: 0.7,
      })
    });

    const data = await response.json();
    console.log('Respuesta de Cohere:', data);

    if (data.generations && data.generations.length > 0) {
      return data.generations[0].text.trim();
    } else {
      throw new Error('No se recibió una respuesta válida de Cohere');
    }
  } catch (error) {
    console.error('Error al obtener consejos de Cohere:', error);
    throw new Error('Lo siento, no se pudieron obtener consejos en este momento.');
  }
}