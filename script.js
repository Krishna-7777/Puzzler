var search = location.search.split("?s=")[1];
let isHidden = true;
let image = new Image();

function script(flag, url) {
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
    let pieceMoved = false;
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
        let extraWidth = image.naturalWidth - screenWidth
        let extraHeight = image.naturalHeight - screenHeight
        if (extraWidth < 0)
            extraWidth = 0
        extraWidth = Math.floor(extraWidth / 2)
        if (extraHeight < 0)
            extraHeight = 0
        extraHeight = Math.floor(extraHeight / 2)
        if (image.naturalWidth > screenWidth)
            image.width = screenWidth
        if (image.naturalHeight > screenHeight)
            image.height = screenHeight
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
                ctx.drawImage(image, extraWidth + (col * tileWidth), extraHeight + (row * tileHeight), tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
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

        let div2 = 8, div1;
        for (let i = 0; i < 600; i++) {
            div1 = Math.floor(Math.random() * 8)
            if (!(div1 == 3 && div2 == 2) && !(div1 == 6 && div2 == 5) && !(div1 == 2 && div2 == 3) && !(div1 == 5 && div2 == 6) && (div1 + 1 == div2 || div1 - 1 == div2 || div1 - 3 == div2 || div1 + 3 == div2)) {
                let replace = divs[div1]
                divs[div1] = divs[div2]
                divs[div2] = replace
                div2 = div1
            }
            progress = 0
            for (let i = 0; i < pieces; i++) {
                if (i == divs[i].id) {
                    progress++
                }
            }
            if (progress == 0)
                break;
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

                    if (!(divClicked == 3 && emptyDiv == 2) && !(divClicked == 6 && emptyDiv == 5) && !(divClicked == 2 && emptyDiv == 3) && !(divClicked == 5 && emptyDiv == 6) && (divClicked + 1 == emptyDiv || divClicked - 1 == emptyDiv || divClicked - 3 == emptyDiv || divClicked + 3 == emptyDiv)) {
                        let replace = divs[divClicked]
                        divs[divClicked] = divs[emptyDiv]
                        divs[emptyDiv] = replace
                        pieceMoved = true
                    }
                    render()
                    pieceMoved = false
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
        if (pieceMoved) {
            progress = Math.floor((progress / 9) * 100)
            if (progress != 100)
                progress += Math.floor(Math.random() * 5) + 1
            document.getElementById("progress").innerText = progress + "%"
        }
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
