window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const addMark = (url) => {
    if (!url) return url
    if (url.includes('?domin='+domin)) return url
    if (url.includes('?')&&url.includes('=')){
       return url + '&domin='+domin
    }else{
       return url + '?domin='+domin 
    }
}

// 拦截所有 a 标签点击
document.addEventListener('click', (e) => {
    const a = e.target.closest('a')
    if (a && a.href) {
        a.href = addMark(a.href)
    }
})

// 拦截 window.open
const _open = window.open
window.open = function(url, ...rest) {
    return _open.call(window, addMark(url), ...rest)
}

// 拦截 location.assign
const _assign = window.location.assign
window.location.assign = function(url) {
    _assign.call(window.location, addMark(url))
}

// 拦截 location.replace
const _replace = window.location.replace
window.location.replace = function(url) {
    _replace.call(window.location, addMark(url))
}

function containsSubstring(mainStr, subStr, caseSensitive = true) {
    if (!caseSensitive) {
        mainStr = mainStr.toLowerCase();
        subStr = subStr.toLowerCase();
    }
    return mainStr.indexOf(subStr) !== -1;
}

var temp = window.location.host;
if(containsSubstring(temp,"tauri.localhost")){
  var domin = temp;
}else{
  let urlParams = new URLSearchParams(window.location.search); // window.location.href
  console.log(urlParams);
  var domin = urlParams.get('domin');
}
//console.log(domin);
// 初始化跳转
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href+'?domin='+domin
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    console.log('real')
    location.href = url+'?domin='+domin
  
}

document.addEventListener('click', hookClick, { capture: true })




console.log('回到主页脚本已加载')

window.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('div')
    btn.style.position = 'fixed'
    btn.style.bottom = '20px'
    btn.style.right = '20px'
    btn.style.width = '70px'
    btn.style.height = '70px'
    btn.style.backgroundColor = '#ff4757'
    btn.style.color = '#fff'
    btn.style.borderRadius = '50%'
    btn.style.display = 'flex'
    btn.style.justifyContent = 'center'
    btn.style.alignItems = 'center'
    btn.style.fontSize = '14px'
    btn.style.fontWeight = 'bold'
    btn.style.cursor = 'pointer'
    btn.style.userSelect = 'none'
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'
    btn.textContent = '主页'

    document.body.appendChild(btn)

    let isDragging = false
    let offsetX = 0
    let offsetY = 0

    btn.addEventListener('mousedown', (e) => {
        isDragging = false
        offsetX = e.clientX - btn.offsetLeft
        offsetY = e.clientY - btn.offsetTop

        const moveHandler = (e) => {
            isDragging = true
            btn.style.left = (e.clientX - offsetX) + 'px'
            btn.style.top = (e.clientY - offsetY) + 'px'
            btn.style.right = 'auto'
            btn.style.bottom = 'auto'
        }

        const upHandler = () => {
            document.removeEventListener('mousemove', moveHandler)
            document.removeEventListener('mouseup', upHandler)

            if (isDragging) {
                const screenWidth = window.innerWidth
                const btnCenter = btn.offsetLeft + btn.offsetWidth / 2

                if (btnCenter < screenWidth / 2) {
                    btn.style.left = '10px'
                } else {
                    btn.style.left = (screenWidth - btn.offsetWidth - 10) + 'px'
                }
            }
        }

        document.addEventListener('mousemove', moveHandler)
        document.addEventListener('mouseup', upHandler)
    })

    btn.addEventListener('click', () => {
        if (!isDragging) {
            window.location.href = 'http://'+domin
        }
    })
})
