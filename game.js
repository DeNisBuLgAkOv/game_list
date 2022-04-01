function imgError(img) {
  img.src = "https://icon-library.com/images/file-icon-size/file-icon-size-19.jpg"
  img.onerror = ""
  return true
}

let GAMES_DATA = null

window.arr = []
const added_list = document.querySelector('.added_list')


function add(props, key, target) {
//    console.log(props, key, target)
  if (window.arr.find(f => f.name == props.name)) {
    return false
  }

  if (window.arr.length == 0) {
    const summ = document.querySelector('.summ')
    summ.innerHTML = "Сумма"
    const span = document.createElement('span')
    span.className = "price_game"
    summ.appendChild(span)
    const a = document.createElement('a')
    a.className = "remove_all"
    a.innerHTML = "Очистить все "
    added_list.parentElement.appendChild(a)
    a.onclick = () => removeAll()

  }
  const p = document.createElement('p')
  p.className = "added_game"
  const spanGame = document.createElement('span')
  spanGame.className = "game"
  const spanClose = document.createElement('span')
  spanClose.className = "close"
  spanClose.innerHTML = "x"
  spanClose.onclick = () => removeGame(props, key, p, target)
  window.arr.push(props)
  priceGame()
  spanGame.innerHTML = props.name
  added_list.appendChild(p)
  p.appendChild(spanGame)
  p.appendChild(spanClose)
  target.innerHTML = "В списке"
  target.style.color = "#6cfe91"
  target.onclick = () => removeGame(props, key, p, target)


}


function dragDrop(props, key, target, div) {

  div.draggable = true
  const dropZone = document.querySelector('.basket')
  const handleDragEnter = e => {
      if (e.target) {
          add(props, key, target)
          //console.log(props, key, target)
          e.target.removeEventListener('dragenter', handleDragEnter)
      }
  }
  dropZone.addEventListener('dragenter', handleDragEnter)
}


function removeAll() {
  window.arr = []
  const games = document.querySelectorAll('.added_game')
  const btns = document.querySelectorAll('.btn_add')
  btns.forEach((btn, index) => {
    btn.onclick = () => add(GAMES_DATA[index + 1], index + 1, btn)
    btn.innerHTML = "Добавить"
    btn.style.color = "#5bb9e5"
  })
  for (let i = 0; i < games.length; i++) {
    games[i].remove()
  }
  document.querySelector('.remove_all').remove()
  priceGame()

}

function removeGame(props, index, p, target) {

  const name = props.name
  p.remove()
  window.arr = window.arr.filter(f => f.name !== name)

  target.onclick = () => add(props, index, target)
  target.innerHTML = "Добавить"
  target.style.color = "#5bb9e5"
  if (window.arr.length == 0) {
    document.querySelector('.remove_all').remove()
  }
  priceGame()
}


function priceGame() {
  const price_game = document.querySelector('.price_game')
  let count_price = 0
  for (let key in window.arr) {

    count_price += window.arr[key].price ?? 0


  }
  price_game.innerHTML = count_price
  if (count_price == 0) {
    document.querySelector('.summ').innerHTML = ""
  }
}


(async function getResponse() {
  let response = await fetch('https://gist.githubusercontent.com/Greyewi/e6cfa49e478387a7b878e4430e1f4223/raw/d045a5c2c977cf05d05ae1a4625762e69cc891c8/game_list.json')
  let content = await response.json()

  GAMES_DATA = content

  const game_list = document.querySelector('.game_list')
  for (let key in content) {

    const div = document.createElement('div')
    div.className = "block"
    div.onmousedown = (event) => dragDrop(content[key], key, event.target.parentElement.querySelector('button'), div)
    const img = document.createElement('img')
    img.src = content[key].cover
    img.onerror = (event) => imgError(event.target)
    const div_but = document.createElement('div')
    const button = document.createElement('button')
    button.className = 'btn_add'
    button.innerHTML = "Добавить"
    button.onclick = (event) => add(content[key], key, event.target)
    const p = document.createElement('p')
    p.innerHTML = content[key].name
    const span_price = document.createElement('span')
    span_price.className = "span_price"
    const p_price = document.createElement('p')
    const distinctPrice = content[key].price || 0
    p_price.innerHTML = distinctPrice ? distinctPrice + " руб." : ""


    div.appendChild(img)
    div.appendChild(div_but)
    div_but.appendChild(button)
    div.appendChild(p)
    div.appendChild(span_price)
    span_price.appendChild(p_price)
    game_list.appendChild(div)


    // game_list.innerHTML += `<div class="block">
    //                             <img src="${ content[key].cover }" alt="" onerror="imgError(this)" width="150px" height="210px">
    //                             <div><button onclick='add(${JSON.stringify((content[key]))},${key})'>Добавить</button></div>
    //                             <p> ${ content[key].name}</p>
    //                             ${content[key].price ? `<p>${content[key].price}рублей</p>`:""}
    //                         </div>`   


  }


})()



