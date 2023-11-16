const MinusKeywordsTemplate = require('../db/minusKeywordsTemplate');

function filterUniqueObjects(arr) {
  const seen = new Set();
  return arr.filter(obj => {
    const objValues = Object.values(obj);
    const objString = JSON.stringify(objValues);
    if (seen.has(objString)) {
      return false;
    } else {
      seen.add(objString);
      return true;
    }
  });
}


module.exports = async function(templates, UserId){
  const result = [];

  const minusKeywordsTemplatesInfo = [];
  for (let template of templates){
    const tmp = await MinusKeywordsTemplate.findOne({
      where: {
        Template: template,
        UserId
      }
    });
    if (tmp) {
      minusKeywordsTemplatesInfo.push({
        Template: tmp.Template,
        Keywords: tmp.Keywords
      })
    }
  }
  
  const minusKeywordsTemplates = filterUniqueObjects(minusKeywordsTemplatesInfo);

  for (const template of templates){
    const requiredTemplates = minusKeywordsTemplates.filter(item => item.Template === template);
    
    if (requiredTemplates.length){
      for (let temp of requiredTemplates){

        const regex = /(["“«])([^"”»]+)(["”»])\s*,?/g;
        const keywords = [];
        let match;
        
        while ((match = regex.exec(temp.Keywords)) !== null) {
          keywords.push(match[1] + match[2] + match[3]);
        }

        for (let keyword of keywords){
          const res = keyword.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '').replace(/«/g, '').replace(/»/g, '').toLowerCase();
          if ( res && res !== ', ') result.push(res);
        }
      }
    } else {
      const res = template.toLowerCase();
      if (res && res !== ', ')
        result.push(res);
    }
  }

  return result;
}