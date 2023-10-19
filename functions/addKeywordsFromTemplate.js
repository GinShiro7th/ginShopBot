const MinusKeywordsTemplate = require('../db/minusKeywordsTemplate');

module.exports = async function(templates){
  const result = [];

  const minusKeywordsTemplates = await MinusKeywordsTemplate.findAll();

  for (const template of templates){
    const requiredTemplates = minusKeywordsTemplates.filter(item => item.Template.toLowerCase() === template);
    if (requiredTemplates.length !== 0){
      for (let temp of requiredTemplates){
        const keywords = temp.Keywords.split(',').map(item => item.trim());
        for (let keyword of keywords){
          const res = keyword.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '').replace(/«/g, '').replace(/»/g, '').toLowerCase();
          if (res)
            result.push(res);
        }
      }
    } else {
      const res = template.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '').replace(/«/g, '').replace(/»/g, '').toLowerCase();
      if (res)
        result.push(res);
    }
  }

  return result;
}