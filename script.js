var search = location.search.split("?s=")[1]
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
let imageSrc = `https://picsum.photos/${screenWidth}/${screenHeight}`
if (!!search)
    imageSrc = `https://loremflickr.com/${screenWidth}/${screenHeight}/${search}`
const puzzle = document.getElementById('puzzle');
let image = new Image();
let divs = []
var pieces = 9;
let progress = 0
let notInPlace = []
let lastPiece;
image.src = imageSrc;
puzzle.setAttribute("style", `width:${image.width}px`)

image.onerror = () => {
    image = new Image()
    image.src = "https://picsum.photos/1600/1200"
    image.onload = load
}

image.onload = load

function load() {
    const tileWidth = image.width / 3;
    const tileHeight = image.height / 3;
    var id = 0

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let canvas = document.createElement('canvas');
            canvas.width = tileWidth;
            canvas.height = tileHeight;
            canvas.id = id++
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, col * tileWidth, row * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
            canvas.className = "pieces"
            if (row == 2 && col == 2) {
                lastPiece = canvas
                canvas = document.createElement('canvas')
                canvas.id = 8
                canvas.className = "pieces"
                canvas.width = tileWidth
                canvas.height = tileHeight
                divs.push(canvas)
            }
            else
                divs.push(canvas)
        }
    }

    for (let i = pieces - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [divs[i], divs[j]] = [divs[j], divs[i]];
    }

    render()

    document.querySelectorAll(".pieces").forEach((piece) => {
        piece.addEventListener("click", (e) => {
            if (progress != 9) {
                let divClicked = e.target.name;
                let emptyDiv;

                divs.find((div, i) => {
                    emptyDiv = div.name;
                    return div.id == 8
                })

                if (divClicked + 1 == emptyDiv || divClicked - 1 == emptyDiv || divClicked - 3 == emptyDiv || divClicked + 3 == emptyDiv) {
                    let replace = divs[divClicked]
                    divs[divClicked] = divs[emptyDiv]
                    divs[emptyDiv] = replace
                }
                render()
            }
        })

    })
};

function render() {
    progress = 0
    for (let i = 0; i < pieces; i++) {
        divs[i].name = i
        if (i == divs[i].id) {
            divs[i].classList.remove('grayscale')
            progress++
        }
        else{
            notInPlace.push(divs[i].id)
            divs[i].classList.add('grayscale')
        }
        document.getElementById('puzzle').appendChild(divs[i]);
    }
    // console.log(progress)
    if (progress == 7) {
        // console.log(notInPlace)
    } else {
        notInPlace = []
    }
    if (progress == 9) {
        document.getElementById('puzzle').innerHTML = ""
        divs[pieces - 1] = lastPiece
        for (let i = 0; i < pieces; i++) {
            divs[i].name = i
            document.getElementById('puzzle').appendChild(divs[i]);
        }
    }
}


