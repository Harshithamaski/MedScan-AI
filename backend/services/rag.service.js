const medicalKnowledge = require('./medicalKnowledge');

/**
 * Simple keyword-based RAG retrieval
 * Finds relevant medical context based on extracted text
 */
const retrieveMedicalContext = (extractedText) => {
  if (!extractedText || extractedText.trim().length === 0) {
    return '';
  }

  const textLower = extractedText.toLowerCase();
  const relevantContexts = [];
  const matchedIds = new Set();

  for (const entry of medicalKnowledge) {
    if (matchedIds.has(entry.id)) continue;

    let matchCount = 0;
    for (const keyword of entry.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      relevantContexts.push({
        id: entry.id,
        context: entry.context,
        relevanceScore: matchCount
      });
      matchedIds.add(entry.id);
    }
  }

  // Sort by relevance and take top 4
  relevantContexts.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const topContexts = relevantContexts.slice(0, 4);

  if (topContexts.length === 0) {
    return '';
  }

  const contextString = topContexts
    .map(c => c.context)
    .join('\n\n');

  return contextString;
};

module.exports = { retrieveMedicalContext };
