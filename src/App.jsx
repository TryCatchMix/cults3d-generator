import { Check, Copy, Download, FileText, Image, Tag, Wand2 } from 'lucide-react';
import React, { useState } from 'react';

const Cults3DGenerator = () => {
  const [figureName, setFigureName] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const generateContent = async () => {
    if (!figureName.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Genera contenido para Cults3D de una figura STL de: "${figureName}"

Debes responder ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin backticks):
{
  "title": "título SEO optimizado",
  "description": "descripción en markdown con detalles técnicos, versiones incluidas, y para qué es ideal",
  "tags": "tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10",
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
  "salesTip": "consejo de ventas relevante"
}

Importante: 
- El título debe ser atractivo y con keywords relevantes
- La descripción debe incluir características técnicas, versiones (pre-supported solid, hollow with drain holes)
- Tags separados por comas, mínimo 15 tags relevantes
- Base name y todos los image names en minúsculas con guiones
- Sales tip específico para este tipo de figura`
            }
          ],
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      // Limpiar posibles backticks de markdown
      const cleanContent = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      
      setGeneratedData(parsed);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar contenido. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(generatedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedData.baseName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const CopyButton = ({ text, field }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      title="Copiar"
    >
      {copiedField === field ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Wand2 className="w-10 h-10 text-purple-400" />
            Generador de Fichas Cults3D
          </h1>
          <p className="text-gray-300">Crea contenido SEO optimizado para tus modelos STL</p>
        </div>

        {/* Input Form */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl mb-6">
          <label className="block text-white font-semibold mb-3">
            Nombre de la figura o modelo
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={figureName}
              onChange={(e) => setFigureName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateContent()}
              placeholder="Ej: figura warhammer gótica, dragón medieval, elfo guerrero..."
              className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              onClick={generateContent}
              disabled={loading || !figureName.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {generatedData && (
          <div className="space-y-6">
            {/* Export Button */}
            <div className="flex justify-end">
              <button
                onClick={exportToJSON}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar JSON
              </button>
            </div>

            {/* Title */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Título
                </h3>
                <CopyButton text={generatedData.title} field="title" />
              </div>
              <p className="text-white text-lg">{generatedData.title}</p>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Descripción (Markdown)
                </h3>
                <CopyButton text={generatedData.description} field="description" />
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                  {generatedData.description}
                </pre>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <CopyButton text={generatedData.tags} field="tags" />
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedData.tags.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Image Names */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Nombres de Imágenes SEO
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-900 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Nombre base:</p>
                  <div className="flex items-center justify-between">
                    <code className="text-green-400">{generatedData.baseName}</code>
                    <CopyButton text={generatedData.baseName} field="baseName" />
                  </div>
                </div>
                
                {Object.entries(generatedData.imageNames).map(([key, value]) => (
                  <div key={key} className="bg-gray-900 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1 capitalize">{key}:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-blue-400">{value}</code>
                      <CopyButton text={value} field={`image-${key}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Tip */}
            <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-yellow-300">💡 Consejo de Ventas</h3>
                <CopyButton text={generatedData.salesTip} field="salesTip" />
              </div>
              <p className="text-yellow-100">{generatedData.salesTip}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!generatedData && !loading && (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <Wand2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Introduce el nombre de tu figura y genera contenido optimizado para Cults3D
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cults3DGenerator;