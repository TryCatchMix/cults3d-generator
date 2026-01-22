export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { figureName } = req.body;

  if (!figureName) {
    return res.status(400).json({ error: 'figureName is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modelo más barato y rápido
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en SEO para Cults3D. Respondes ÚNICAMENTE con JSON válido, sin markdown ni backticks.'
          },
          {
            role: 'user',
            content: `Genera contenido para Cults3D de una figura STL de: "${figureName}"

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "title": "título SEO optimizado",
  "description": "descripción en markdown con detalles técnicos, versiones incluidas (pre-supported solid, hollow with drain holes), y para qué es ideal",
  "tags": "tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, tag11, tag12, tag13, tag14, tag15",
  "baseName": "nombre-base-para-imagenes-separado-por-guiones",
  "imageNames": {
    "main": "nombre-main",
    "front": "nombre-front-view",
    "side": "nombre-side-view",
    "back": "nombre-back-view",
    "animated": "nombre-animated-gif",
    "detail": "nombre-detail",
    "render": "nombre-raw-render"
  },
  "salesTip": "consejo de ventas relevante y específico"
}

El título debe ser atractivo con keywords relevantes. La descripción debe incluir características técnicas. Mínimo 15 tags relevantes separados por comas. Base name y todos los image names en minúsculas con guiones.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en la API de OpenAI');
    }

    const content = data.choices[0].message.content;
    
    // Limpiar posibles backticks de markdown
    const cleanContent = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanContent);

    res.status(200).json(parsed);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error al generar contenido',
      message: error.message 
    });
  }
}