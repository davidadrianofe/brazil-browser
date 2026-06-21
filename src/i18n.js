let locales = {}

export default {
  init(map){
    locales = map
  },
  t(key, lang='pt-BR'){
    const keys = key.split('.')
    const pack = locales[lang] || locales['pt-BR'] || {}
    let v = pack
    for (const k of keys){
      v = v && v[k]
      if (!v) return key
    }
    return v
  }
}
