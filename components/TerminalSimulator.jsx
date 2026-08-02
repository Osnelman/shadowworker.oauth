import React, { useState, useEffect, useRef } from 'react'

export default function TerminalSimulator({ initialFiles = {}, expected = null, onSuccess = () => {}, onFailure = () => {}, validate = null, expectedCommand = null, prompt = 'linux-quest$' }) {
  const [cwd, setCwd] = useState('/')
  const [fs, setFs] = useState(() => {
    const store = { '/': { type: 'dir', children: {} } }
    Object.entries(initialFiles || {}).forEach(([name, content]) => {
      const path = '/' + name.replace(/^\//, '')
      store[path] = { type: 'file', content: String(content) }
      store['/'].children[name] = true
    })
    return store
  })
  const [history, setHistory] = useState([
    { type: 'out', text: 'Bienvenue dans le terminal interactif ! Tape `help` pour commencer.' },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [isSolved, setIsSolved] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const print = (text) => setHistory((h) => [...h, { type: 'out', text }])

  const pathJoin = (base, name) => {
    if (name.startsWith('/')) return name
    if (base === '/') return `/${name}`
    return `${base.replace(/\/$/, '')}/${name}`
  }

  const isDir = (p) => fs[p] && fs[p].type === 'dir'
  const isFile = (p) => fs[p] && fs[p].type === 'file'

  const listDir = (p) => {
    if (!isDir(p)) return null
    const children = []
    Object.keys(fs).forEach((k) => {
      if (k === p) return
      // immediate children
      if (k.startsWith(p === '/' ? '/' : p + '/')) {
        const rest = k.slice(p === '/' ? 1 : p.length + 1)
        if (rest && !rest.includes('/')) children.push(rest)
      }
    })
    return Array.from(new Set(children)).sort()
  }

  const ensureDir = (p) => {
    if (!fs[p]) setFs((prev) => ({ ...prev, [p]: { type: 'dir', children: {} } }))
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
        print(cwd)
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
          } else {
            const p = pathJoin(cwd, name)
            ensureDir(p)
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
          }
        }
        break
      }

      case 'cd': {
        const dest = args[0] || '/'
        const path = dest.startsWith('/') ? dest : pathJoin(cwd, dest)
        if (!isDir(path)) { print(`cd: ${dest}: No such file or directory`) } else setCwd(path)
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
        }
        break
      }

      case 'mv': {
        const [src, dest] = args
        if (!src || !dest) { print('mv: missing file operand') } else {
          const ps = src.startsWith('/') ? src : pathJoin(cwd, src)
          const pd = dest.startsWith('/') ? dest : pathJoin(cwd, dest)
          movePath(ps, pd)
        }
        break
      }

      case 'cp': {
        const [src, dest] = args
        if (!src || !dest) { print('cp: missing file operand') } else {
          const ps = src.startsWith('/') ? src : pathJoin(cwd, src)
          const pd = dest.startsWith('/') ? dest : pathJoin(cwd, dest)
          copyPath(ps, pd)
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
      let success = false;
      if (validate) {
        // Use the custom validate function if provided
        success = validate(line, history.map(h => h.text).join('\n'), fs);
      } else if (expectedCommand) {
        // Fallback to simple command match if expectedCommand is provided
        success = line.trim().startsWith(expectedCommand.trim());
      } else if (expected) {
        // Fallback to checking output/files for expected string
        const outputs = history.concat([{ type: 'cmd', text: line }]);
        const outText = outputs.map((o) => o.text).join('\n');
        const filesText = Object.entries(fs).map(([k, v]) => `${k}:${v.type === 'file' ? v.content : '[dir]'}`).join('\n');
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
