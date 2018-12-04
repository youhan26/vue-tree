const images = {}

const loader = function (imageUrl) {
  return new Promise(function (resolve, reject) {
    const image = new Image()
    image.onload = function () {
      resolve(image)
    }
    image.onerror = function () {
      reject(new Error('image load err' + imageUrl))
    }
    image.src = imageUrl
  })
}

function imageLoader(...urls) {
  return Promise.all(urls.map(function (url) {
    return loader(url)
  }))
}

/**
 * return add/minus image url
 * @param type
 * @returns {Promise<*>}
 */
const imageHelper = async function (type) {
  if (Object.keys(images).length <= 0) {
    const types = ['add', 'minus']
    const initImages = await imageLoader(
      require('../assets/add.png'),
      require('../assets/minus.png'),
    )
    initImages.forEach(function (image, index) {
      images[types[index]] = image
    })
  }
  if (type) {
    return images[type]
  }
  return images
}


export default imageHelper
