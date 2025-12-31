window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 判断系统类型

// function getSystemType() {
//     const ua = navigator.userAgent;
//     const platform = navigator.platform;
//     // iOS（包含 iPhone / iPad / iPod）
//     if (/iPhone|iPad|iPod/i.test(ua)) {
//         return "iOS";
//     }
//     // Android
//     if (/Android/i.test(ua)) {
//         return "Android";
//     }
//     // Windows
//     if (/Win/i.test(platform)) {
//         return "Windows";
//     }
//     // macOS
//     if (/Mac/i.test(platform)) {
//         return "macOS";
//     }
//     // Linux（排除 Android）
//     if (/Linux/i.test(platform)) {
//         return "Linux";
//     }
//     return "Unknown";
// }
// console.log(getSystemType());

// 拦截链接保证主页地址传输
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

// 基本逻辑
function containsSubstring(mainStr, subStr, caseSensitive = true) {
    if (!caseSensitive) {
        mainStr = mainStr.toLowerCase();
        subStr = subStr.toLowerCase();
    }
    return mainStr.indexOf(subStr) !== -1;
}
var temp = new URLSearchParams(window.location.search).get('domin')
if (temp==null){
    var domin = window.location.href
}else{
    //var domin = getSystemType()
    var domin = temp
}
console.log(window.location);
console.log(domin);

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




// 主页按钮设计
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('div')
    btn.innerText = '主页'
    btn.style.position = 'fixed'
    btn.style.bottom = '30px'
    btn.style.right = '20px'
    btn.style.width = '60px'
    btn.style.height = '60px'
    btn.style.background = 'rgba(255, 80, 80, 0.95)'
    btn.style.color = '#fff'
    btn.style.fontSize = '16px'
    btn.style.fontWeight = 'bold'
    btn.style.display = 'flex'
    btn.style.alignItems = 'center'
    btn.style.justifyContent = 'center'
    btn.style.borderRadius = '50%'
    btn.style.zIndex = '99999'
    btn.style.userSelect = 'none'
    btn.style.cursor = 'pointer'
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'
    document.body.appendChild(btn)

    let isDragging = false
    let moved = false
    let startX = 0
    let startY = 0
    let originX = 0
    let originY = 0

    const start = (e) => {
        const touch = e.touches ? e.touches[0] : e
        isDragging = true
        moved = false
        startX = touch.clientX
        startY = touch.clientY
        originX = btn.offsetLeft
        originY = btn.offsetTop
    }

    const move = (e) => {
        if (!isDragging) return
        const touch = e.touches ? e.touches[0] : e
        const dx = touch.clientX - startX
        const dy = touch.clientY - startY

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true

        btn.style.left = originX + dx + 'px'
        btn.style.top = originY + dy + 'px'
        btn.style.right = 'auto'
    }

    const end = () => {
        if (!isDragging) return
        isDragging = false

        if (!moved) {
            if (containsSubstring(domin,"file:///")){
                window.history.go(-window.history.length + 1);
            }else{
            window.location.href = domin
            }
            return
        }

        // 自动吸边
        const screenW = window.innerWidth
        const btnW = btn.offsetWidth
        const currentLeft = btn.offsetLeft

        const targetLeft = currentLeft + btnW / 2 < screenW / 2
            ? 10
            : screenW - btnW - 10

        btn.style.transition = 'left 0.25s ease'
        btn.style.left = targetLeft + 'px'

        setTimeout(() => {
            btn.style.transition = ''
        }, 300)
    }

    btn.addEventListener('mousedown', start)
    btn.addEventListener('touchstart', start)

    window.addEventListener('mousemove', move)
    window.addEventListener('touchmove', move)

    window.addEventListener('mouseup', end)
    window.addEventListener('touchend', end)
})
