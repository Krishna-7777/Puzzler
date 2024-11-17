var search = location.search.split("?s=")[1];
let isHidden = true;
let image = new Image();

function script(flag, url) {
    console.log("script");
    let randomQuery = `?${new Date().getTime()}`
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    let imageSrc = url ?? `https://picsum.photos/${screenWidth}/${screenHeight}/?q=${randomQuery}`
    if (!!search)
        imageSrc = url ?? `https://loremflickr.com/${screenWidth}/${screenHeight}/${search}/?q=${randomQuery}`
    const puzzle = document.getElementById('puzzle');
    puzzle.innerHTML = ""
    let divs = []
    var pieces = 9;
    let progress = 0
    let notInPlace = []
    let lastPiece;
    if (!flag)
        image.src = imageSrc;

    image.onerror = () => {
        image = new Image()
        image.src = `https://picsum.photos/${screenWidth}/${screenHeight}`
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
            else {
                divs[i].classList.add('grayscale')
            }
            document.getElementById('puzzle').appendChild(divs[i]);
        }
        if (progress == 9) {
            document.getElementById('puzzle').innerHTML = ""
            divs[pieces - 1] = lastPiece
            for (let i = 0; i < pieces; i++) {
                divs[i].name = i
                document.getElementById('puzzle').appendChild(divs[i]);
            }
        }
        progress = Math.floor((progress / 9) * 100)
        if (progress != 100)
            progress += Math.floor(Math.random() * 5) + 1
        document.getElementById("progress").innerText = progress + "%"
    }
}

script()

let input = document.getElementById("search");
function searchText() {
    if (!!input.value) {
        search = input.value
        window.history.pushState({},
            "", `/?s=${search}`);
        script()
    } else {
        input.focus()
    }
}

input.addEventListener('keydown', (e) => {
    if (e.keyCode == 13)
        searchText()
})

function toggleDialog() {
    if (isHidden)
        document.getElementById("upload").classList.remove('hidden')
    else
        document.getElementById("upload").classList.add('hidden')
    isHidden = !isHidden
}

function handleFileUpload() {
    let fileInput = document.getElementById('fileInput')
    let imgUrl = document.getElementById('url')
    toggleDialog()
    if (fileInput?.files?.length) {
        const reader = new FileReader();
        reader.onload = () => {
            image.src = reader.result
            script(true)
        }
        reader.readAsDataURL(fileInput.files[0]);
    } else if (!!imgUrl?.value) {
        script(false, imgUrl.value)
    }
}
