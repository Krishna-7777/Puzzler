// let imageSrc = 'https://cbcjamaica.files.wordpress.com/2015/04/numbers-from-1-to-12.jpg';
// let imageSrc = 'https://www.travelandleisure.com/thmb/NjZjqqzUWc0pvwQtAIPo1sR9lvM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/hallerbos-forest-halle-belgium-2-BEAUTFORESTS0721-4ff5b556613e4814b5b7165f8851de39.jpg';
// let imageSrc = 'https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
var search = location.search.split("?s=")[1]
let imageSrc = "https://picsum.photos/1600/1200"
if (!!search)
    imageSrc = "https://loremflickr.com/1600/1200/" + search
// let imageSrc = "https://i0.wp.com/laruephoto.com/wp-content/uploads/2018/08/Animated-Star-Trails-Sedona.gif?ssl=1"
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
    console.log(image.width);
    image.width = 1200
    image.height = 900
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
        if (i == divs[i].id)
            progress++
        else
            notInPlace.push(divs[i].id)
        document.getElementById('puzzle').appendChild(divs[i]);
    }
    console.log(progress)
    if (progress == 7) {
        console.log(notInPlace)
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


