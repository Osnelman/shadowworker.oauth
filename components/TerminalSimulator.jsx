import React, { useState, useEffect, useRef } from 'react'

export default function TerminalSimulator({ initialFiles = {}, expected = null, onSuccess = () => {}, onFailure = () => {}, validate = null, expectedCommand = null, prompt = 'linux-quest$' }) {
  const HOME_DIR = '/home/etudiant'
  const DEFAULT_CWD = `${HOME_DIR}/projet`

  const ensureNode = (store, p) => {
    if (!store[p]) store[p] = { type: 'dir', children: {} }
    return store[p]
  }

  const createRealisticFs = (baseInitialFiles = {}) => {
    const store = { '/': { type: 'dir', children: {} } }
    const folders = [HOME_DIR, `${HOME_DIR}/projet`, `${HOME_DIR}/bank`, `${HOME_DIR}/ecole`, `${HOME_DIR}/documents`]

    folders.forEach((folder) => {
      const parts = folder.split('/').filter(Boolean)
      let current = ''
      parts.forEach((part) => {
        current = `${current}/${part}`
        ensureNode(store, current)
        const parent = current.split('/').slice(0, -1).join('/') || '/'
        if (!store[parent].children) store[parent].children = {}
        store[parent].children[part] = true
      })
    })

    Object.entries(baseInitialFiles || {}).forEach(([name, content]) => {
      const path = '/' + name.replace(/^\//, '')
      const parent = path.split('/').slice(0, -1).join('/') || '/'
      ensureNode(store, parent)
      if (!store[parent].children) store[parent].children = {}
      const leaf = path.split('/').pop()
      store[parent].children[leaf] = true
      store[path] = { type: 'file', content: String(content) }
    })

    return store
  }

  const displayPath = (p) => {
    if (p === '/') return '/'
    if (p === HOME_DIR) return '~'
    if (p.startsWith(HOME_DIR + '/')) return `~/${p.slice(HOME_DIR.length + 1)}`
    return p
  }

  const [cwd, setCwd] = useState(DEFAULT_CWD)
  const [fs, setFs] = useState(() => createRealisticFs(initialFiles))
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [isSolved, setIsSolved] = useState(false)
  const inputRef = useRef(null)
  const historyRef = useRef(history)
  const fsRef = useRef(fs)
  const solvedRef = useRef(isSolved)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { historyRef.current = history }, [history])
  useEffect(() => { fsRef.current = fs }, [fs])
  useEffect(() => { solvedRef.current = isSolved }, [isSolved])

  const print = (text) => setHistory((h) => [...h, { type: 'out', text }])

  const pathJoin = (base, name) => {
    if (name === '.') return base
    if (name === '..') {
      if (base === '/') return '/'
      const parts = base.split('/').filter(Boolean)
      parts.pop()
      return parts.length ? `/${parts.join('/')}` : '/'
    }
    if (name.startsWith('/')) return name
    if (base === '/') return `/${name}`
    return `${base.replace(/\/$/, '')}/${name}`
  }

  const resolvePath = (base, raw = '') => {
    if (!raw || raw === '~') return HOME_DIR
    if (raw === '.') return base
    if (raw === '..') return pathJoin(base, '..')
    return raw.startsWith('/') ? raw : pathJoin(base, raw)
  }

  const isDir = (p) => fs[p] && fs[p].type === 'dir'
  const isFile = (p) => fs[p] && fs[p].type === 'file'

  const listDir = (p) => {
    if (!isDir(p)) return null
    const dir = fs[p]
    const children = Object.keys(dir.children || {})
    return children.sort()
  }

  const ensureDir = (p) => {
    setFs((prev) => {
      const cp = { ...prev }
      if (!cp[p]) cp[p] = { type: 'dir', children: {} }
      const parent = p.split('/').slice(0, -1).join('/') || '/'
      if (!cp[parent]) cp[parent] = { type: 'dir', children: {} }
      const name = p.split('/').pop()
      if (name) {
        cp[parent].children = cp[parent].children || {}
        cp[parent].children[name] = true
      }
      return cp
    })
  }

  const readFile = (p) => (isFile(p) ? fs[p].content : null)
  const writeFile = (p, content) => setFs((prev) => ({ ...prev, [p]: { type: 'file', content: String(content) } }))
  const removePath = (p) => {
    setFs((prev) => {
      const cp = { ...prev }
      Object.keys(cp).forEach((k) => { if (k === p || k.startsWith(p + '/')) delete cp[k] })
      return cp
    })
  }
  const movePath = (src, dest) => {
    setFs((prev) => {
      const cp = { ...prev }
      Object.keys(cp).forEach((k) => {
        if (k === src || k.startsWith(src + '/')) {
          const rel = k.slice(src.length)
          cp[dest + rel] = cp[k]
          delete cp[k]
        }
      })
      return cp
    })
  }
  const copyPath = (src, dest) => {
    setFs((prev) => {
      const cp = { ...prev }
      Object.keys(prev).forEach((k) => {
        if (k === src || k.startsWith(src + '/')) {
          const rel = k.slice(src.length)
          cp[dest + rel] = JSON.parse(JSON.stringify(prev[k]))
        }
      })
      return cp
    })
  }

  const runCommand = (line) => {
    setHistory((h) => [...h, { type: 'cmd', text: line }])
    setCmdHistory((h) => [...h, line])
    const parts = line.trim().split(/\s+/)
    const cmd = parts[0]
    const args = parts.slice(1)

    if (!cmd) return

    switch (cmd) {
      case 'pwd':
        print(displayPath(cwd))
        break

      case 'clear':
        setHistory([])
        break

      case 'ls': {
        const opt = args.filter((a) => a.startsWith('-'))[0]
        const target = args.find((a) => !a.startsWith('-')) || cwd
        const path = target.startsWith('/') ? target : pathJoin(cwd, target)
        const list = listDir(path)
        if (!list) { print(`ls: cannot access '${target}': No such file or directory`) } else {
          if (opt === '-l') {
            list.forEach((name) => {
              const p = pathJoin(path, name)
              const t = fs[p] ? fs[p].type : 'file'
              print(`${t === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'} 1 user group 0 ${name}`)
            })
          } else {
            print(list.join('  '))
          }
        }
        break
      }

      case 'mkdir': {
        const name = args[0]
        if (!name) { print('mkdir: missing operand') } else {
          if (name === '-p' && args[1]) {
            const parts = args[1].split('/')
            let build = cwd
            parts.forEach((part) => {
              build = pathJoin(build, part)
              ensureDir(build)
            })
            print(`Dossier créé : ${args[1]}`)
          } else {
            const p = pathJoin(cwd, name)
            ensureDir(p)
            print(`Dossier créé : ${p}`)
          }
        }
        break
      }

      case 'rmdir': {
        const name = args[0]
        if (!name) { print('rmdir: missing operand') } else {
          const p = name.startsWith('/') ? name : pathJoin(cwd, name)
          if (!isDir(p)) { print(`rmdir: failed to remove '${name}': No such directory`) } else {
            removePath(p)
            print(`Dossier supprimé : ${p}`)
          }
        }
        break
      }

      case 'cd': {
        const dest = args[0] || '~'
        const path = resolvePath(cwd, dest)
        if (!isDir(path)) { print(`cd: ${dest}: No such file or directory`) } else {
          setCwd(path)
          print(`Emplacement actuel : ${displayPath(path)}`)
        }
        break
      }

      case 'cat': {
        const name = args[0]
        if (!name) { print('cat: missing operand') } else {
          const p = name.startsWith('/') ? name : pathJoin(cwd, name)
          const content = readFile(p)
          if (content === null) { print(`cat: ${name}: No such file or directory`) } else { print(content) }
        }
        break
      }

      case 'touch': {
        const name = args[0]
        if (!name) { print('touch: missing file operand') } else {
          const p = name.startsWith('/') ? name : pathJoin(cwd, name)
          writeFile(p, '')
          print(`Fichier créé : ${p}`)
        }
        break
      }

      case 'echo': {
        const gt = line.split('>')
        if (gt.length === 2) {
          const val = gt[0].replace(/^echo\s+/, '').trim().replace(/^"|"$/g, '')
          const name = gt[1].trim()
          const p = name.startsWith('/') ? name : pathJoin(cwd, name)
          writeFile(p, val)
          print(`Écriture réussie dans ${p}`)
        } else {
          print(parts.slice(1).join(' '))
        }
        break
      }

      case 'rm': {
        const opt = args[0] === '-r'
        const target = opt ? args[1] : args[0]
        if (!target) { print('rm: missing operand') } else {
          const p = target.startsWith('/') ? target : pathJoin(cwd, target)
          if (opt) removePath(p)
          else setFs((prev) => { const cp = { ...prev }; delete cp[p]; return cp })
          print(`Suppression effectuée : ${p}`)
        }
        break
      }

      case 'mv': {
        const [src, dest] = args
        if (!src || !dest) { print('mv: missing file operand') } else {
          const ps = src.startsWith('/') ? src : pathJoin(cwd, src)
          const pd = dest.startsWith('/') ? dest : pathJoin(cwd, dest)
          movePath(ps, pd)
          print(`Déplacement effectué : ${ps} → ${pd}`)
        }
        break
      }

      case 'cp': {
        const [src, dest] = args
        if (!src || !dest) { print('cp: missing file operand') } else {
          const ps = src.startsWith('/') ? src : pathJoin(cwd, src)
          const pd = dest.startsWith('/') ? dest : pathJoin(cwd, dest)
          copyPath(ps, pd)
          print(`Copie effectuée : ${ps} → ${pd}`)
        }
        break
      }

      case 'chmod': {
        if (!args[0] || !args[1]) { print('chmod: missing operands') } else {
          print('Permissions modifiées (simulé)')
        }
        break
      }

      case 'chown': {
        if (!args[0] || !args[1]) { print('chown: missing operands') } else {
          print('Propriétaire modifié (simulé)')
        }
        break
      }

      case 'tree': {
        const p = args[0] ? (args[0].startsWith('/') ? args[0] : pathJoin(cwd, args[0])) : cwd
        const walk = (root, prefix = '') => {
          const list = listDir(root) || []
          list.forEach((name, i) => {
            const np = pathJoin(root, name)
            print(prefix + (i === list.length - 1 ? '└─ ' : '├─ ') + name)
            if (isDir(np)) walk(np, prefix + (i === list.length - 1 ? '   ' : '│  '))
          })
        }
        print(p)
        walk(p)
        break
      }

      case 'find': {
        const term = args[0] || '.'
        const results = []
        Object.keys(fs).forEach((k) => { if (k.includes(term)) results.push(k) })
        results.forEach((r) => print(r))
        break
      }

      case 'grep': {
        const needle = args[0]
        const target = args[1]
        if (!needle || !target) { print('grep: missing operands') } else {
          const p = target.startsWith('/') ? target : pathJoin(cwd, target)
          const content = readFile(p)
          if (content === null) { print(`grep: ${target}: No such file`) } else {
            content.split('\n').forEach((line) => { if (line.includes(needle)) print(line) })
          }
        }
        break
      }

      case 'history':
        cmdHistory.forEach((c, i) => print(`${i + 1}  ${c}`))
        break

      case 'help':
        print('Chaque défi contient les indices nécessaires. Relis l’objectif, puis essaie ta commande.')
        break

      default:
        print(`« ${cmd} » ne correspond pas à ce défi. Relis l’objectif et essaie une autre commande.`)
    }

    // success check
    setTimeout(() => { // Delay to allow output to render
      if (solvedRef.current) return

      const latestHistory = historyRef.current
      const latestFs = fsRef.current
      let success = false;
      if (validate) {
        // Use the custom validate function if provided
        success = validate(line, latestHistory.map(h => h.text).join('\n'), latestFs);
      } else if (expectedCommand) {
        // Fallback to simple command match if expectedCommand is provided
        success = line.trim().startsWith(expectedCommand.trim());
      } else if (expected) {
        // Fallback to checking output/files for expected string
        const outputs = latestHistory.concat([{ type: 'cmd', text: line }]);
        const outText = outputs.map((o) => o.text).join('\n');
        const filesText = Object.entries(latestFs).map(([k, v]) => `${k}:${v.type === 'file' ? v.content : '[dir]'}`).join('\n');
        success = outText.includes(expected) || filesText.includes(expected);
      }

      if (success) {
        setIsSolved(true);
        onSuccess();
      } else {
        onFailure(); // Call onFailure if not successful
      }
    }, 100); // A slightly longer delay to ensure all output is processed
  }

  const submit = (e) => {
    e.preventDefault()
    runCommand(input)
    setInput('')
  }

  return (
    <div className="terminal card">
      <div className="terminal-screen">
        {history.map((h, i) => (
          <div key={i} className={h.type === 'cmd' ? 'term-cmd' : 'term-out'} dangerouslySetInnerHTML={{ __html: h.text }} />
        ))}
      </div>
      <form onSubmit={submit} className="terminal-input">
        <span className="prompt">{prompt}</span>
        <input
          disabled={isSolved}
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input"
          autoComplete="off"
        />
      </form>
    </div>
  )
}
