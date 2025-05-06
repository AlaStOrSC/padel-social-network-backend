export async function fetchPadelNews() {
    const apiKey = '401b2fbf75414816b67c3f9578599117';
    const url = `https://newsapi.org/v2/everything?q=padel&language=es&sortBy=publishedAt&pageSize=4&apiKey=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener las noticias');
      }
      const data = await response.json();
      return data.articles;
    } catch (error) {
      console.error('Error obteniendo las noticias:', error);
      throw error;
    }
  }