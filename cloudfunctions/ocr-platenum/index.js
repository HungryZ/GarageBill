const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  console.log('imageUrl: ' + event.imageUrl)
  try {
    const result = await cloud.openapi.ocr.platenum({
        "type": 'photo',
        // img: {
        //   contentType: 'image/png',
        //   value: event.imageBuffer
        // }
        "imgUrl": event.imageUrl
      })
    return result
  } catch (err) {
    return err
  }
}