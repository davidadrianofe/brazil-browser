import React, { useEffect, useState, useRef } from 'react'
import pt from '../locales/pt-BR.json'
import en from '../locales/en.json'
import i18n from '../i18n'

const defaultHome = 'https://www.google.com'

function useStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? JSON.parse(s) : initial
    } catch { return initial }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])
  return [state, setState]
}

export default function App(){
  const [lang, setLang] = useStorage('brzil_lang', 'pt-BR')
  const t = (k) => i18n.t(k, lang)
  const [tabs, setTabs] = useStorage('brzil_tabs', [{ id: Date.now(), url: defaultHome, title: 'Nova aba' }])
  const [active, setActive] = useStorage('brzil_active', tabs[0].id)
  const [address, setAddress] = useState('')
  const webviewRefs = useRef({})

  useEffect(()=>{ i18n.init({pt, en}) },[])

  function newTab(url = defaultHome){
    const tab = { id: Date.now(), url, title: 'Nova aba' }
    setTabs(s => { const next = [...s, tab]; setActive(tab.id); return next })
  }

  function closeTab(id){
    setTabs(s => {
      const next = s.filter(x => x.id !== id)
      if (next.length === 0) newTab()
      if (id === active && next.length>0) setActive(next[next.length-1].id)
      return next
    })
  }

  function navigateTo(url){
    if (!/^https?:\/\//.test(url)) url = 'https://' + url
    setTabs(s => s.map(tab => tab.id === active ? {...tab, url} : tab))
    const ref = webviewRefs.current[active]
    if (ref) ref.loadURL(url)
  }

  function updateActiveUrl(id){
    const tab = tabs.find(t => t.id === id)
    if (tab) setAddress(tab.url)
  }

  useEffect(()=> updateActiveUrl(active), [active, tabs])

  const [bookmarks, setBookmarks] = useStorage('brzil_bookmarks', [])
  const [history, setHistory] = useStorage('brzil_history', [])

  function addBookmark(){
    const tab = tabs.find(t=>t.id===active)
    if (tab) setBookmarks(b => [...b, { id: Date.now(), title: tab.title || tab.url, url: tab.url }])
  }

  function recordHistory(url, title){
    setHistory(h => [{ id: Date.now(), url, title, ts: Date.now() }, ...h].slice(0,200))
  }

  function onWebviewDidFinishLoad(id, e){
    const ref = webviewRefs.current[id]
    if (!ref) return
    ref.getTitle().then(title => {
      setTabs(s => s.map(t => t.id===id ? {...t, title: title || t.url} : t))
    }).catch(()=>{})
    ref.getURL().then(url => recordHistory(url, ''))
  }

  return (
    <div className="app">
      <div className="toolbar">
        <button onClick={()=> newTab()}>{t('new_tab')}</button>
        <button onClick={()=> { const ref = webviewRefs.current[active]; if(ref) ref.goBack() }}>{t('back')}</button>
        <button onClick={()=> { const ref = webviewRefs.current[active]; if(ref) ref.goForward() }}>{t('forward')}</button>
        <button onClick={()=> { const ref = webviewRefs.current[active]; if(ref) ref.reload() }}>{t('reload')}</button>
        <input value={address} onChange={e=>setAddress(e.target.value)} onKeyDown={e=> e.key==='Enter' && navigateTo(address)} placeholder={t('address_placeholder')} />
        <button onClick={addBookmark}>{t('bookmark')}</button>
        <select value={lang} onChange={e=> setLang(e.target.value)}>
          <option value="pt-BR">PT-BR</option>
          <option value="en">EN</option>
        </select>
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <div key={tab.id} className={`tab ${tab.id===active ? 'active':''}`} onClick={()=> setActive(tab.id)}>
            {tab.title || tab.url}
            <button style={{marginLeft:8}} onClick={(e)=>{ e.stopPropagation(); closeTab(tab.id) }}>×</button>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="left">
          <div className="webviews">
            {tabs.map(tab => (
              <webview
                key={tab.id}
                ref={el => webviewRefs.current[tab.id] = el}
                src={tab.url}
                style={{ display: tab.id===active ? 'block':'none' }}
                preload=""
                onDidFinishLoad={() => onWebviewDidFinishLoad(tab.id)}
              />
            ))}
          </div>
        </div>

        <div className="sidebar">
          <h3>{t('bookmarks')}</h3>
          <ul>
            {bookmarks.map(b => <li key={b.id}><a href="#" onClick={(e)=>{ e.preventDefault(); setTabs(s=> s.map(t=> t.id===active ? {...t, url: b.url} : t)); }}> {b.title} </a></li>)}
          </ul>

          <h3>{t('history')}</h3>
          <ul style={{maxHeight:200, overflow:'auto'}}>
            {history.map(h => <li key={h.id}><a href="#" onClick={(e)=>{ e.preventDefault(); setTabs(s=> s.map(t=> t.id===active ? {...t, url: h.url} : t)); }}>{new Date(h.ts).toLocaleString()} — {h.url}</a></li>)}
          </ul>

          <h3>{t('about')}</h3>
          <div>
            <strong>brzil</strong><br/>
            {t('about_text')}<br/>
            <em>David Adriano Ferrari dos Santos — CEO / Criador</em>
          </div>
        </div>
      </div>

      <div className="bottom">brzil — {t('made_by')}</div>
    </div>
  )
}
