const MinusKeywordsTemplate = require('../db/minusKeywordsTemplate');

module.exports = async function(templates){
  const result = [];

  const minusKeywordsTemplates = await MinusKeywordsTemplate.findAll();

  for (const template of templates){
    const requiredTemplates = minusKeywordsTemplates.filter(item => item.Template.toLowerCase() === template);
    if (requiredTemplates.length !== 0){
      for (let temp of requiredTemplates){
        const keywords = temp.Keywords.split(',').map(item => item.trim());
        for (let keyword of keywords)
          result.push(keyword.replace(/"/g, '').toLowerCase());
      }
    } else {
      result.push(template.replace(/"/g, '').toLowerCase());
    }
  }

  return result;
}