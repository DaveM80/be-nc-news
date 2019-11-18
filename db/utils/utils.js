exports.formatDates = list => {
  let  objArr = [...list];
  return objArr.map(obj => {
      let newObj = {...obj}
       newObj.created_at = new Date(newObj.created_at).toUTCString()
       return newObj
  })
  
};

exports.makeRefObj = list => {
  let  newObj = {};
       list.forEach(item => {
        newObj[item.title] = item.article_id
      })
      return newObj
};

exports.formatComments = (comments, articleRef) => {
  let  objArr = [...comments];
  return objArr.map(obj => {
      let newObj = {...obj}
      newObj.author = newObj.created_by
      newObj.article_id = articleRef[newObj.belongs_to]

      delete newObj.created_by
      delete newObj.belongs_to
      newObj.created_at = new Date(newObj.created_at).toUTCString()
      return newObj
  })

};
