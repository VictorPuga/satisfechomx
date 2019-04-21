function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function (key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function (key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}

const objectToArrayWithKeys = (obj) => Object.keys(obj).map(key => ({ key, value: obj[key] }))

const unifyDataObjects = (arr) => {
  let originalObject = {}
  let derivedObject = {}
  arr.forEach(({ parameters }) => {
    if (parameters) {
      objectToArrayWithKeys(parameters).forEach(({ key, value }) => {
        if (key.search('.original') !== -1) {
          originalObject[key.replace('.original', '')] = value
        }
        else {
          derivedObject[key] = value
        }
      })
    }
  })

  const { donation_expiration_date, donation_photo, donation_location, facebook_sender_id, phone_number } = derivedObject
  const { donation_pick_up_by_time, donation_amount, donation_quantity, donation_content } = originalObject
  return {
    facebook_sender_id,
    phone_number,
    donation_content,
    donation_quantity,
    donation_amount,
    donation_expiration_date,
    donation_pick_up_by_time,
    donation_photo,
    donation_location,
  }
}

const getDate = (date) => date.match(/\d\d\d\d-\d\d-\d\d/gi)[0]

exports = module.exports = stringify
exports.getSerialize = serializer
exports.unifyDataObjects = unifyDataObjects
exports.objectToArrayWithKeys = objectToArrayWithKeys
exports.getDate = getDate